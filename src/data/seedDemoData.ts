/**
 * Default demo data seeder.
 *
 * Populates every localStorage-backed store with a consistent, realistic demo
 * dataset for the student Harshit Seth (IT Jodhpur) so the app feels fully
 * populated out of the box. Each section only seeds when its store is empty,
 * so real user data is never overwritten.
 *
 * Triggered once on app boot via App.tsx.
 */
import {
  Skill,
  SkillLevels,
  Project,
  Internship,
  OnCampusApplication,
  OffCampusApplication,
  CollegeSelectedStudentRecord,
} from '../types';
import { StoredResume } from './resumeStore';
import { StoredCertificate } from './certificateStore';
import {
  saveStudentSkills,
  saveCurriculumCatalog,
  createDefaultLevelsForSkill,
  calculateSkillProficiency,
} from './skillsStore';
import { saveProjects } from './projectsStore';
import { saveInternships } from './jobsStore';
import { saveStoredResumes } from './resumeStore';
import { saveStudentCertificates } from './certificateStore';
import {
  saveDriveRequests,
  CampusDriveRequest,
} from './driveRequestsStore';
import {
  saveSkillRequests,
} from './skillRequestsStore';
import { StudentSkillRequest } from './skillRequestsStore';
import { saveCollegeApproachRequests, CollegeApproachRequest } from './collegeApproachStore';
import { saveBatchFeedbackList, saveFeedbackList, CompanyBatchFeedback, CandidateFeedback } from './feedbackStore';
import { addNotification } from './notificationStore';
import { saveLoginSessions, UserLoginSession } from './sessionTrackingStore';
import { saveApprovalRecords, ApprovalRecord } from './approvalStore';
import { saveDailyStreakState, getTodayDateString, getYesterdayDateString } from './dailyQuizStore';
import { addCompanyImprovementPath, generateCompanyPathFromJob } from './improvementPathStore';
import { studentApplicationsStore } from './studentApplicationsStore';

// ==========================================
// HELPERS
// ==========================================

type TierKey = 'beginner' | 'intermediate' | 'advance';

const completeFirstN = (levels: SkillLevels, counts: Record<TierKey, number>): SkillLevels => {
  const copy: SkillLevels = JSON.parse(JSON.stringify(levels));
  (['beginner', 'intermediate', 'advance'] as TierKey[]).forEach((key) => {
    copy[key].checkpoints.forEach((cp, idx) => {
      cp.completed = idx < counts[key];
    });
  });
  return copy;
};

const freshLevels = (name: string, category: Skill['category']): SkillLevels => {
  const copy: SkillLevels = JSON.parse(JSON.stringify(createDefaultLevelsForSkill(name, category)));
  (['beginner', 'intermediate', 'advance'] as TierKey[]).forEach((key) => {
    copy[key].checkpoints.forEach((cp) => {
      cp.completed = false;
    });
  });
  return copy;
};

const displayLevel = (p: number): Skill['level'] =>
  p >= 67 ? 'Advanced' : p >= 34 ? 'Intermediate' : 'Beginner';

const makeSkill = (
  name: string,
  category: Skill['category'],
  counts: Record<TierKey, number>,
  opts: { status?: Skill['status']; assessmentScore?: number; verifiedDate?: string } = {}
): Skill => {
  const levels = completeFirstN(createDefaultLevelsForSkill(name, category), counts);
  const calc = calculateSkillProficiency(levels);
  return {
    id: `seed-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name,
    category,
    proficiency: calc.proficiency,
    level: displayLevel(calc.proficiency),
    status: opts.status ?? 'self-claimed',
    verifiedDate: opts.verifiedDate,
    quizAvailable: true,
    levels,
    assessmentScore: opts.assessmentScore,
    assessmentAttemptDate: opts.assessmentScore ? 'Sep 22, 2026' : undefined,
    beginnerVerified: opts.status === 'verified',
  };
};

// ==========================================
// SKILLS + CURRICULUM
// ==========================================

const seedSkillsList: Skill[] = [
  makeSkill('React', 'Frontend', { beginner: 2, intermediate: 2, advance: 2 }, { status: 'verified', assessmentScore: 96, verifiedDate: 'AI Verified (96%)' }),
  makeSkill('JavaScript', 'Frontend', { beginner: 2, intermediate: 2, advance: 2 }, { status: 'verified', assessmentScore: 94, verifiedDate: 'AI Verified (94%)' }),
  makeSkill('TypeScript', 'Frontend', { beginner: 2, intermediate: 2, advance: 1 }, { status: 'verified', assessmentScore: 88, verifiedDate: 'AI Verified (88%)' }),
  makeSkill('HTML', 'Frontend', { beginner: 2, intermediate: 2, advance: 1 }, { status: 'verified', assessmentScore: 92, verifiedDate: 'AI Verified (92%)' }),
  makeSkill('CSS', 'Frontend', { beginner: 2, intermediate: 2, advance: 1 }, { status: 'verified', assessmentScore: 90, verifiedDate: 'AI Verified (90%)' }),
  makeSkill('Python', 'Backend', { beginner: 3, intermediate: 2, advance: 1 }, { status: 'verified', assessmentScore: 95, verifiedDate: 'AI Verified (95%)' }),
  makeSkill('Node.js', 'Backend', { beginner: 2, intermediate: 2, advance: 1 }, { status: 'verified', assessmentScore: 85, verifiedDate: 'AI Verified (85%)' }),
  makeSkill('PostgreSQL', 'Database', { beginner: 3, intermediate: 2, advance: 1 }, { status: 'verified', assessmentScore: 89, verifiedDate: 'AI Verified (89%)' }),
  makeSkill('Machine Learning (AI/ML)', 'AI / Data', { beginner: 2, intermediate: 2, advance: 1 }, { status: 'verified', assessmentScore: 97, verifiedDate: 'AI Verified (97%)' }),
  makeSkill('Algorithms & Problem Solving', 'Core CS', { beginner: 2, intermediate: 2, advance: 1 }, { status: 'verified', assessmentScore: 86, verifiedDate: 'AI Verified (86%)' }),
  makeSkill('Redis', 'Database', { beginner: 1, intermediate: 0, advance: 0 }, { status: 'self-claimed', verifiedDate: 'Added from Curriculum' }),
  makeSkill('Docker & Containers', 'DevOps', { beginner: 2, intermediate: 1, advance: 0 }, { status: 'self-claimed', verifiedDate: 'Added from Curriculum' }),
  makeSkill('System Design & High Availability', 'Core CS', { beginner: 2, intermediate: 1, advance: 0 }, { status: 'self-claimed', verifiedDate: 'Added from Curriculum' }),
];

const seedCurriculumList: Skill[] = seedSkillsList.map((s) => ({
  id: `curr-${s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  name: s.name,
  category: s.category,
  proficiency: 0,
  level: 'Beginner' as const,
  status: 'verified' as const,
  levels: freshLevels(s.name, s.category),
}));

// ==========================================
// PROJECTS
// ==========================================

const seedProjectsList: Project[] = [
  {
    id: 'seed-proj-tracknest',
    title: 'TrackNest — Full-Stack Placement Tracker',
    description:
      'A production-grade placement tracker with role-based dashboards, ATS-style skill matching, and real-time application pipelines built for college TPOs and students.',
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    repoUrl: 'https://github.com/harshitsetheh-droid/tracknest',
    liveUrl: 'https://tracknest-demo.vercel.app',
    originalityScore: 94,
    status: 'passed',
    verifiedDate: 'Sep 18, 2026',
    qnaPassed: true,
    methodsAnalyzed: ['System Design Review', 'AST Code Audit', 'Database Indexing'],
    architectureSummary:
      'Clean 3-tier architecture with a REST API, PostgreSQL with indexed relational schema, and a React SPA consuming typed contracts.',
    questionsScore: { correct: 4, total: 5 },
  },
  {
    id: 'seed-proj-synthai',
    title: 'SynthAI — ML Resume Skill Extractor',
    description:
      'Extracts and verifies skills from resumes using an ML pipeline with NER tagging, then cross-checks candidates against college curriculum catalogs.',
    techStack: ['Python', 'FastAPI', 'Machine Learning (AI/ML)', 'PostgreSQL'],
    repoUrl: 'https://github.com/harshitsetheh-droid/synthai',
    originalityScore: 91,
    status: 'passed',
    verifiedDate: 'Sep 20, 2026',
    qnaPassed: true,
    methodsAnalyzed: ['Model Card Review', 'Data Pipeline Audit', 'AST Code Audit'],
    architectureSummary:
      'FastAPI service with a scikit-learn NER pipeline, vector embeddings, and async ingestion workers.',
    questionsScore: { correct: 5, total: 5 },
  },
  {
    id: 'seed-proj-cloudcache',
    title: 'CloudCache Proxy — Redis & PostgreSQL',
    description:
      'A caching reverse proxy that accelerates API reads using Redis with fallback-to-PostgreSQL persistence and Dockerized deployment.',
    techStack: ['Node.js', 'Redis', 'Docker', 'PostgreSQL'],
    repoUrl: 'https://github.com/harshitsetheh-droid/cloudcache-proxy',
    originalityScore: 88,
    status: 'pending',
  },
  {
    id: 'seed-proj-portfolio',
    title: 'Legacy Static Portfolio',
    description: 'A template-based personal portfolio reused from an open-source theme without significant custom work.',
    techStack: ['HTML', 'CSS', 'React'],
    repoUrl: 'https://github.com/harshitsetheh-droid/portfolio',
    originalityScore: 38,
    status: 'flagged',
    flagReason: 'Heavy similarity to public template; only ~38% original content. Verification required before ATS credit.',
  },
];

// ==========================================
// INTERNSHIPS
// ==========================================

const seedInternshipsList: Internship[] = [
  {
    id: 'seed-job-technova-frontend',
    title: 'Frontend Developer Intern',
    company: 'TechNova Solutions',
    location: 'Bengaluru, Karnataka',
    type: 'Internship',
    stipend: '₹35,000 / month',
    matchScore: 87,
    requiredSkills: ['React', 'TypeScript', 'CSS'],
    preferredSkills: ['Node.js', 'PostgreSQL'],
    missingSkills: [],
    description: 'Build responsive product dashboards, design systems, and high-performance frontends for B2B SaaS clients.',
    applicantsCount: 124,
    deadline: 'Oct 15, 2026',
    isApplied: true,
    campusType: 'off_campus',
  },
  {
    id: 'seed-job-cloudmatrix-backend',
    title: 'Backend Engineer Intern',
    company: 'CloudMatrix',
    location: 'Remote (India)',
    type: 'Internship',
    stipend: '₹28,000 / month',
    matchScore: 72,
    requiredSkills: ['Node.js', 'PostgreSQL', 'Docker'],
    preferredSkills: ['Redis'],
    missingSkills: ['Docker', 'Redis'],
    description: 'Design scalable REST and event-driven services with PostgreSQL and containerized deploy pipelines.',
    applicantsCount: 98,
    deadline: 'Oct 20, 2026',
    campusType: 'off_campus',
  },
  {
    id: 'seed-job-neurospark-ml',
    title: 'ML Engineer Intern',
    company: 'NeuroSpark AI',
    location: 'Hyderabad, Telangana',
    type: 'Internship',
    stipend: '₹40,000 / month',
    matchScore: 91,
    requiredSkills: ['Python', 'Machine Learning (AI/ML)'],
    preferredSkills: ['PostgreSQL'],
    missingSkills: [],
    description: 'Own end-to-end ML experiments, feature pipelines, and model evaluation for NLP products.',
    applicantsCount: 210,
    deadline: 'Oct 12, 2026',
    isApplied: true,
    campusType: 'off_campus',
  },
  {
    id: 'seed-job-innovate-sde',
    title: 'Software Engineer Intern (PPO Track)',
    company: 'InnovateStack',
    location: 'Institute of Technology, Jodhpur (On Campus)',
    type: 'Internship',
    stipend: '₹30,000 / month',
    matchScore: 89,
    requiredSkills: ['React', 'Node.js', 'PostgreSQL'],
    preferredSkills: ['TypeScript'],
    missingSkills: [],
    description: 'Campus recruitment drive for full-stack interns with PPO conversion based on performance.',
    applicantsCount: 56,
    deadline: 'Oct 25, 2026',
    campusType: 'on_campus',
    targetUniversity: 'Institute of Technology, Jodhpur',
    driveStartDate: 'Nov 2, 2026',
    driveEndDate: 'Nov 5, 2026',
    tpoApprovalStatus: 'approved',
  },
  {
    id: 'seed-job-desynova-ui',
    title: 'UI/UX Frontend Intern',
    company: 'Desynova',
    location: 'Institute of Technology, Jodhpur (On Campus)',
    type: 'Internship',
    stipend: '₹22,000 / month',
    matchScore: 64,
    requiredSkills: ['React', 'CSS'],
    preferredSkills: ['TypeScript'],
    missingSkills: [],
    description: 'Design engineering internship focused on pixel-perfect implementation of marketing and product pages.',
    applicantsCount: 0,
    deadline: 'Oct 30, 2026',
    campusType: 'on_campus',
    targetUniversity: 'Institute of Technology, Jodhpur',
    driveStartDate: 'Nov 9, 2026',
    driveEndDate: 'Nov 11, 2026',
    tpoApprovalStatus: 'pending',
  },
];

// ==========================================
// RESUME
// ==========================================

const seedResume: StoredResume = {
  id: 'seed-resume-harshit',
  fileName: 'Harshit_Seth_Fullstack.pdf',
  fileSize: '248 KB',
  uploadedAt: 'Sep 21, 2026',
  atsScore: 92,
  formattingScore: 95,
  keywordMatchScore: 90,
  skillCoverageScore: 91,
  candidateName: 'Harshit Seth',
  email: 'harshitseth.work@gmail.com',
  phone: '+91 98765 43210',
  education: 'B.Tech CSE, Institute of Technology, Jodhpur (CGPA 8.9)',
  verifiedProjectsCount: 2,
  status: 'active',
  rawHighlights: [
    'Built & defended 2 flagship projects (TrackNest, SynthAI) with 91%+ originality',
    '8 skills AI-verified with average assessment score 92%',
    'Led college tech fest frontend squad (30+ members)',
  ],
  extractedSkills: seedSkillsList.slice(0, 10).map((s) => ({
    name: s.name,
    category: s.category,
    proficiency: s.proficiency,
    confidence: 93,
  })),
};

// ==========================================
// CERTIFICATES
// ==========================================

const makeCert = (
  id: string,
  title: string,
  issuer: string,
  domain: string,
  recipient: string,
  status: StoredCertificate['status'],
  score: number,
  credentialId: string,
  opts: { fake?: boolean; color?: string; uploadedAt?: string } = {}
): StoredCertificate => {
  const nameMatched = recipient === 'Harshit Seth';
  return {
    id: `seed-cert-${id}`,
    title,
    workDomain: domain,
    issuerCompany: issuer,
    recipientName: recipient,
    nameMatchesUser: nameMatched,
    issueDate: 'Aug 10, 2026',
    credentialId,
    credentialUrl: `https://verify.example/${credentialId}`,
    status,
    aiAudit: {
      isValid: status === 'verified',
      overallTrustScore: score,
      nameMatchCheck: {
        matched: nameMatched,
        detectedName: recipient,
        targetName: 'Harshit Seth',
        details: nameMatched
          ? 'Recipient name exactly matches the logged-in candidate.'
          : 'Recipient name mismatch detected. Possible fabricated credential.',
      },
      companyIssuerCheck: {
        legitimate: !opts.fake,
        companyName: issuer,
        accreditationType: opts.fake ? 'Unrecognized' : 'Global Enterprise',
        details: opts.fake
          ? 'Issuer domain failed accreditation audit and is not a recognized training provider.'
          : `${issuer} is a recognized global credential issuer.`,
      },
      tamperAuditCheck: {
        passed: !opts.fake,
        signatureValid: !opts.fake,
        layoutIntegrity: !opts.fake,
        details: opts.fake
          ? 'Signature block and layout metadata inconsistent with issuer templates.'
          : 'Signature, metadata, and layout all intact and unmodified.',
      },
      workDomain: domain,
      workDomainDescription: opts.fake
        ? 'Credential claims unverified theoretical computing competency.'
        : domain,
      extractedSkills: seedSkillsList.slice(0, 3).map((s) => ({
        name: s.name,
        category: s.category,
        proficiency: s.proficiency,
        confidence: opts.fake ? 30 : 94,
      })),
      auditTimestamp: 'Sep 19, 2026 14:22:05 UTC',
      credentialId,
      credentialUrl: `https://verify.example/${credentialId}`,
    },
    fileName: `${title.replace(/[^a-z0-9]+/gi, '_')}.pdf`,
    fileSize: '512 KB',
    uploadedAt: opts.uploadedAt || 'Sep 19, 2026',
    previewColor: opts.color || '#6366f1',
  };
};

const seedCertificatesList: StoredCertificate[] = [
  makeCert('aws-sa', 'AWS Certified Solutions Architect – Associate', 'Amazon Web Services', 'Cloud Infrastructure, High Availability & Microservices', 'Harshit Seth', 'verified', 97, 'AWS-SAA-2026-88421', { color: '#f59e0b' }),
  makeCert('dlai-ml', 'Machine Learning Specialization', 'DeepLearning.AI', 'Artificial Intelligence, Deep Learning & Predictive Neural Models', 'Harshit Seth', 'verified', 95, 'DLAI-ML-2026-11902', { color: '#0ea5e9' }),
  makeCert('padh-fake', 'Master of Distributed Quantum Computing', 'GlobalFastTrack Tech Academy', 'Unverified Theoretical Computing', 'Rahul K. Verma', 'flagged', 12, 'GFT-QUANTUM-0001', { fake: true, color: '#ef4444' }),
];

// ==========================================
// DRIVE REQUESTS
// ==========================================

const seedDriveRequests: CampusDriveRequest[] = [
  {
    id: 'seed-req-technova',
    companyId: 'COM-1',
    companyName: 'TechNova Solutions',
    companyLogo: 'TN',
    universityName: 'Institute of Technology, Jodhpur',
    jobTitle: 'Frontend Developer Intern',
    jobType: 'Internship',
    stipend: '₹35,000 / month',
    location: 'Bengaluru, Karnataka',
    driveStartDate: 'Nov 2, 2026',
    driveEndDate: 'Nov 3, 2026',
    status: 'approved',
    submittedAt: 'Sep 15, 2026',
    eligibleBranches: ['CSE', 'IT'],
    minCgpa: '7.5',
    roundsPlanned: ['Online Assessment', 'Technical Interview', 'HR'],
    notes: 'Two-day on-campus drive for senior batch students.',
    tpoRemarks: 'Slot approved. Auditorium booked for Nov 2-3.',
  },
  {
    id: 'seed-req-cloudmatrix',
    companyId: 'COM-2',
    companyName: 'CloudMatrix',
    companyLogo: 'CM',
    universityName: 'Institute of Technology, Jodhpur',
    jobTitle: 'Backend Engineer Intern',
    jobType: 'Internship',
    stipend: '₹28,000 / month',
    location: 'Remote (India)',
    driveStartDate: 'Nov 10, 2026',
    driveEndDate: 'Nov 11, 2026',
    status: 'pending',
    submittedAt: 'Sep 24, 2026',
    eligibleBranches: ['CSE', 'IT', 'ECE'],
    minCgpa: '7.0',
    roundsPlanned: ['Coding Test', 'System Design Round'],
    notes: 'Remote virtual drive, logins shared after approval.',
  },
];

// ==========================================
// SKILL REQUESTS
// ==========================================

const seedSkillRequests: StudentSkillRequest[] = [
  {
    id: 'seed-skr-k8s',
    studentName: 'Harshit Seth',
    studentRoll: '22BCSE104',
    collegeName: 'Institute of Technology, Jodhpur',
    skillName: 'Kubernetes',
    category: 'DevOps',
    reason: 'Required for CloudMatrix backend internship and modern container orchestration roles.',
    submittedAt: 'Sep 22, 2026',
    status: 'pending',
  },
  {
    id: 'seed-skr-redis',
    studentName: 'Harshit Seth',
    studentRoll: '22BCSE104',
    collegeName: 'Institute of Technology, Jodhpur',
    skillName: 'Redis',
    category: 'Database',
    reason: 'Caching patterns used in my CloudCache project; want it in curriculum.',
    submittedAt: 'Sep 05, 2026',
    status: 'approved',
    tpoRemarks: 'Added to CSE advanced database electives.',
  },
];

// ==========================================
// COLLEGE APPROACH REQUESTS
// ==========================================

const seedCollegeApproaches: CollegeApproachRequest[] = [
  {
    id: 'seed-appr-technova',
    collegeId: 'UNI-1',
    collegeName: 'Institute of Technology, Jodhpur',
    tpoName: 'Dr. Ananya Sharma',
    tpoEmail: 'tpo@itjodhpur.ac.in',
    tpoPhone: '+91 94140 22331',
    companyId: 'COM-1',
    companyName: 'TechNova Solutions',
    title: 'Campus Placement Drive 2026',
    proposalType: 'Campus Placement Drive',
    targetBatch: 'Batch 2027',
    targetBranches: ['CSE', 'IT'],
    eligibleStudentCount: 240,
    avgCgpa: '8.4',
    verifiedSkillsHighlights: ['React', 'TypeScript', 'Node.js'],
    proposedDriveDates: 'Nov 2 - 3, 2026',
    proposedMode: 'On-Campus (Offline)',
    expectedPackageRange: '₹30,000 - ₹35,000 / month',
    campusFacilities: ['Seminar Hall (300 seats)', 'Computer Lab (120 systems)', 'Interview Cabins'],
    coverLetter: 'We invite TechNova to recruit from our CSE & IT final-year cohort with strong full-stack and product engineering exposure.',
    submittedAt: 'Sep 14, 2026',
    status: 'approved',
    companyRemarks: 'Proposal accepted. Drive scheduled as proposed.',
    hrContactPerson: 'Priya Nair (HR)',
    confirmedDriveDates: 'Nov 2 - 3, 2026',
    approvedAt: 'Sep 16, 2026',
    updatedAt: 'Sep 16, 2026',
    publishedJobId: 'seed-job-innovate-sde',
    isJobPublishedToStudents: true,
  },
  {
    id: 'seed-appr-cloudmatrix',
    collegeId: 'UNI-1',
    collegeName: 'Institute of Technology, Jodhpur',
    tpoName: 'Dr. Ananya Sharma',
    tpoEmail: 'tpo@itjodhpur.ac.in',
    companyId: 'COM-2',
    companyName: 'CloudMatrix',
    title: 'Internship & PPO Pool',
    proposalType: 'Internship & PPO Pool',
    targetBatch: 'Batch 2027',
    targetBranches: ['CSE', 'IT', 'ECE'],
    eligibleStudentCount: 300,
    avgCgpa: '8.1',
    verifiedSkillsHighlights: ['Node.js', 'PostgreSQL'],
    proposedDriveDates: 'Nov 10 - 11, 2026',
    proposedMode: 'Virtual / Remote',
    expectedPackageRange: '₹28,000 / month',
    campusFacilities: ['Lab Batch Scheduling', 'Proctor Support'],
    coverLetter: 'Seeking a virtual internship pool agreement for backend engineering talent.',
    submittedAt: 'Sep 24, 2026',
    status: 'pending',
  },
];

// ==========================================
// FEEDBACK (BATCH + CANDIDATE)
// ==========================================

const seedBatchFeedback: CompanyBatchFeedback[] = [
  {
    id: 'seed-fb-technova',
    companyName: 'TechNova Solutions',
    collegeName: 'Institute of Technology, Jodhpur',
    department: 'Computer Science & Engineering',
    batchYear: 'Batch 2026',
    hiringDriveTitle: 'Campus Recruitment Drive 2026',
    dateSubmitted: 'Aug 28, 2026',
    missingSkills: ['Docker & Containers', 'System Design & High Availability'],
    requiredSkillsNotFound: ['Containerization with Docker'],
    satisfactorySkills: ['React', 'TypeScript', 'JavaScript', 'SQL'],
    improvementDirective: 'Introduce a mandatory DevOps fundamentals module (Docker, CI/CD) and a system-design lab in the final year for CSE students.',
    studentsEvaluatedCount: 118,
    readinessScore: 68,
    shortlistedCount: 22,
    priority: 'High',
    status: 'Acknowledged by College',
    tpoResponseNote: 'DevOps elective added for next semester.',
    acknowledgedAt: 'Sep 02, 2026',
    responseSubmittedAt: 'Sep 03, 2026',
    acknowledgedBy: 'Dr. Ananya Sharma',
  },
  {
    id: 'seed-fb-cloudmatrix',
    companyName: 'CloudMatrix',
    collegeName: 'Institute of Technology, Jodhpur',
    department: 'Information Technology',
    batchYear: 'Batch 2026',
    hiringDriveTitle: 'Campus Recruitment Drive 2026',
    dateSubmitted: 'Sep 10, 2026',
    missingSkills: ['Docker', 'Redis', 'Kubernetes'],
    requiredSkillsNotFound: ['Container orchestration (Kubernetes)'],
    satisfactorySkills: ['Node.js', 'PostgreSQL'],
    improvementDirective: 'Add an optional specialization track covering containerization, caching, and orchestration fundamentals.',
    studentsEvaluatedCount: 74,
    readinessScore: 61,
    shortlistedCount: 9,
    priority: 'Critical',
    status: 'Delivered to TPO',
  },
];

const seedCandidateFeedback: CandidateFeedback[] = [
  {
    id: 'seed-cf-harshit',
    candidateName: 'Harshit Seth',
    candidateRoll: '22BCSE104',
    collegeName: 'Institute of Technology, Jodhpur',
    companyName: 'TechNova Solutions',
    roleApplied: 'Frontend Developer Intern',
    interviewDate: 'Sep 26, 2026',
    rating: 4,
    technicalCompetency: 88,
    communicationScore: 82,
    problemSolvingScore: 90,
    status: 'Shortlisted for Round 2',
    strengths: ['Strong React fundamentals', 'Clear system design reasoning', 'Clean code with tests'],
    growthAreas: ['Containerization exposure', 'Performance profiling'],
    interviewerNotes: 'Excellent problem framing. Recommended to advance to the final technical round.',
  },
  {
    id: 'seed-cf-neha',
    candidateName: 'Neha Agarwal',
    candidateRoll: '22BCSE101',
    collegeName: 'Institute of Technology, Jodhpur',
    companyName: 'TechNova Solutions',
    roleApplied: 'Frontend Developer Intern',
    interviewDate: 'Sep 26, 2026',
    rating: 5,
    technicalCompetency: 95,
    communicationScore: 90,
    problemSolvingScore: 92,
    status: 'Selected / Offer Extended',
    strengths: ['Deep React + state management', 'Accessibility-aware UI', 'Strong DSA'],
    growthAreas: ['Bilingual documentation'],
    interviewerNotes: 'Top-tier candidate, extended offer immediately.',
  },
];

// ==========================================
// NOTIFICATIONS
// ==========================================

const seedNotifications = () => {
  addNotification({
    title: 'On-Campus Placement Drive: InnovateStack',
    message: 'Dr. Ananya Sharma (TPO Office) announced on-campus drive for InnovateStack ("Software Engineer Intern (PPO Track)" - ₹30,000 / month). Drive Dates: Nov 2, 2026 to Nov 5, 2026. Eligible: CSE, IT. View details & apply!',
    category: 'job',
    targetRole: 'student',
    targetTab: 'internships',
    priority: 'high',
    senderName: 'Placement Cell',
    senderRole: 'institution',
    timestamp: '2 days ago',
  });
  addNotification({
    title: 'TPO Placement Nudge (CSE)',
    message: 'Dr. Ananya Sharma has nudged students in CSE & IT: Upcoming campus drives are starting soon. Ensure your required skills are verified through AST Code Defense and update your resume portfolio.',
    category: 'nudge',
    targetRole: 'student',
    targetTab: 'skills',
    priority: 'urgent',
    stream: 'CSE & IT',
    senderName: 'TPO Office',
    senderRole: 'institution',
    timestamp: '5 hours ago',
    isRead: true,
  });
  addNotification({
    title: 'Hiring Feedback from CloudMatrix (IT)',
    message: 'CloudMatrix submitted campus hiring review for Batch 2026. Highlighted missing skills: Docker, Redis, Kubernetes. Actionable curriculum directives are now available in Feedback.',
    category: 'feedback',
    targetRole: 'institution',
    targetTab: 'feedback',
    priority: 'high',
    senderName: 'CloudMatrix',
    senderRole: 'company',
    timestamp: '1 day ago',
  });
  addNotification({
    title: 'Curriculum Action from Institute of Technology, Jodhpur',
    message: 'TPO at Institute of Technology, Jodhpur has updated feedback status to "Acknowledged by College" for Computer Science & Engineering. Note: "DevOps elective added for next semester."',
    category: 'feedback',
    targetRole: 'company',
    targetTab: 'feedback',
    priority: 'normal',
    senderName: 'TPO, Institute of Technology, Jodhpur',
    senderRole: 'institution',
    timestamp: '3 days ago',
  });
  addNotification({
    title: 'Company Profile Approved by Super Admin',
    message: 'Congratulations! TechNova Solutions has been verified by Super Admin. You can now post campus drives and contact university TPOs directly.',
    category: 'approval',
    targetRole: 'company',
    targetTab: 'dashboard',
    priority: 'normal',
    senderName: 'Super Admin',
    senderRole: 'admin',
    timestamp: 'Sep 12, 2026',
  });
};

// ==========================================
// LOGIN SESSIONS
// ==========================================

const seedSessions: UserLoginSession[] = [
  {
    id: 'seed-sess-harshit-1',
    userId: 'student-harshit',
    userName: 'Harshit Seth',
    userEmail: 'harshitseth.work@gmail.com',
    role: 'student',
    subRoleLabel: 'Student',
    organization: 'Institute of Technology, Jodhpur',
    loginDate: '2026-09-28',
    loginDateDisplay: '28 Sep 2026',
    loginTime: '09:20:14 AM',
    loginTimestamp: Date.now() - 7200 * 1000,
    endTime: 'Active Now',
    durationSeconds: 7200,
    durationDisplay: '2h 0m',
    engagementSeconds: 6100,
    engagementDisplay: '1h 42m active',
    engagementPercentage: 85,
    status: 'active',
    pagesVisited: ['Dashboard', 'My Skills', 'Projects', 'Internships'],
    totalInteractions: 43,
    device: 'Chrome / Windows',
    ipAddress: '103.27.54.11',
    location: 'Jodhpur, Rajasthan',
  },
  {
    id: 'seed-sess-harshit-2',
    userId: 'student-harshit',
    userName: 'Harshit Seth',
    userEmail: 'harshitseth.work@gmail.com',
    role: 'student',
    subRoleLabel: 'Student',
    organization: 'Institute of Technology, Jodhpur',
    loginDate: '2026-09-27',
    loginDateDisplay: '27 Sep 2026',
    loginTime: '10:02:50 AM',
    loginTimestamp: Date.now() - 86400 * 1000,
    endTime: '12:40:12 PM',
    endTimestamp: Date.now() - (86400 - 2.6) * 3600 * 1000,
    durationSeconds: 9432,
    durationDisplay: '2h 37m',
    engagementSeconds: 8200,
    engagementDisplay: '2h 17m active',
    engagementPercentage: 87,
    status: 'completed',
    pagesVisited: ['Dashboard', 'Daily Challenge', 'Resume Analyzer', 'Improvement Paths'],
    totalInteractions: 58,
    device: 'Chrome / Windows',
    ipAddress: '103.27.54.11',
    location: 'Jodhpur, Rajasthan',
  },
  {
    id: 'seed-sess-tpo-1',
    userId: 'institution-tpo',
    userName: 'Dr. Ananya Sharma',
    userEmail: 'tpo@itjodhpur.ac.in',
    role: 'institution',
    subRoleLabel: 'College TPO',
    organization: 'Institute of Technology, Jodhpur',
    loginDate: '2026-09-28',
    loginDateDisplay: '28 Sep 2026',
    loginTime: '08:45:00 AM',
    loginTimestamp: Date.now() - 3 * 3600 * 1000,
    endTime: 'Active Now',
    durationSeconds: 10800,
    durationDisplay: '3h 0m',
    engagementSeconds: 9100,
    engagementDisplay: '2h 32m active',
    engagementPercentage: 84,
    status: 'active',
    pagesVisited: ['Overview', 'Requests', 'Feedback', 'Skills'],
    totalInteractions: 71,
    device: 'Edge / Windows',
    ipAddress: '103.27.54.33',
    location: 'Jodhpur, Rajasthan',
  },
];

// ==========================================
// APPROVAL RECORDS
// ==========================================

const seedApprovalRecords: ApprovalRecord[] = [
  { id: 'seed-appr-com1', name: 'TechNova Solutions', role: 'company', email: 'hr@technova.example', status: 'active', registeredAt: 'Sep 10, 2026', approvedAt: 'Sep 12, 2026' },
  { id: 'seed-appr-com2', name: 'CloudMatrix', role: 'company', email: 'careers@cloudmatrix.example', status: 'active', registeredAt: 'Sep 18, 2026', approvedAt: 'Sep 20, 2026' },
  { id: 'seed-appr-com3', name: 'NeuroSpark AI', role: 'company', email: 'recruit@neurospark.example', status: 'pending_approval', registeredAt: 'Sep 25, 2026' },
  { id: 'seed-appr-uni1', name: 'Institute of Technology, Jodhpur', role: 'institution', email: 'tpo@itjodhpur.ac.in', status: 'active', registeredAt: 'Aug 01, 2026', approvedAt: 'Aug 03, 2026' },
  { id: 'seed-appr-stu1', name: 'Harshit Seth', role: 'student', email: 'harshitseth.work@gmail.com', status: 'active', registeredAt: 'Sep 01, 2026', approvedAt: 'Sep 01, 2026' },
];

// ==========================================
// APPLICATIONS (ON-CAMPUS / OFF-CAMPUS / SELECTED)
// ==========================================

const appliedSkills = () =>
  seedSkillsList.slice(0, 10).map((s) => ({
    name: s.name,
    proficiency: (s.proficiency >= 67 ? 'Advance' : s.proficiency >= 34 ? 'Intermediate' : 'Beginner') as 'Beginner' | 'Intermediate' | 'Advance',
    verified: s.status === 'verified',
    howLearned: 'Lab CS302 (DBMS), Course Project, & AI AST Code Defense',
    score: s.proficiency,
    verificationMethod: (s.status === 'verified' ? 'AI Logic Q&A Defense' : 'Self Claimed') as 'AI Logic Q&A Defense' | 'Self Claimed',
  }));

const certificateEvidence = [
  { id: 'seed-ev-aws', title: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', issueDate: 'Aug 10, 2026', verified: true, credentialUrl: 'https://verify.example/AWS-SAA-2026-88421' },
  { id: 'seed-ev-dlai', title: 'Machine Learning Specialization', issuer: 'DeepLearning.AI', issueDate: 'Aug 10, 2026', verified: true, credentialUrl: 'https://verify.example/DLAI-ML-2026-11902' },
];

const projectEvidence = seedProjectsList
  .filter((p) => p.status === 'passed')
  .map((p) => ({
    id: p.id,
    title: p.title,
    techStack: p.techStack,
    originalityScore: p.originalityScore,
    logicDefenseScore: 92,
    githubUrl: p.repoUrl,
    demoUrl: p.liveUrl,
    summary: p.description,
    status: 'passed' as const,
  }));

const seedOnCampusApps: OnCampusApplication[] = [
  {
    id: 'seed-app-innovate',
    studentId: 'seed-stu-harshit',
    studentName: 'Harshit Seth',
    rollNumber: '22BCSE104',
    collegeName: 'Institute of Technology, Jodhpur',
    branch: 'CSE',
    cgpa: '8.9',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    companyId: 'COM-4',
    companyName: 'InnovateStack',
    companyLogo: 'IV',
    jobTitle: 'Software Engineer Intern (PPO Track)',
    matchScore: 89,
    applicationDate: 'Sep 20, 2026',
    status: 'shortlisted',
    packageOffered: '₹30,000 / month',
    offeredRole: 'Software Engineer Intern (PPO Track)',
    postingLocation: 'Institute of Technology, Jodhpur (On Campus)',
    isTransmittedToTpo: false,
    skillsLearned: appliedSkills(),
    resumeUrl: 'Harshit_Seth_Fullstack.pdf',
    resumeGpa: '8.9',
    resumeSummary: 'Full-stack developer with 2 audited high-originality projects and 8 AI-verified skills. Strong system design and ML exposure.',
    certificates: certificateEvidence,
    projects: projectEvidence,
    links: {
      github: 'https://github.com/harshitsetheh-droid',
      linkedin: 'https://linkedin.com/in/harshitsetheh',
      portfolio: 'https://harshitseth.dev',
      email: 'harshitseth.work@gmail.com',
    },
  },
  {
    id: 'seed-app-desynova',
    studentId: 'seed-stu-harshit',
    studentName: 'Harshit Seth',
    rollNumber: '22BCSE104',
    collegeName: 'Institute of Technology, Jodhpur',
    branch: 'CSE',
    cgpa: '8.9',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    companyId: 'COM-5',
    companyName: 'Desynova',
    companyLogo: 'DE',
    jobTitle: 'UI/UX Frontend Intern',
    matchScore: 64,
    applicationDate: 'Sep 24, 2026',
    status: 'applied',
    isTransmittedToTpo: false,
    skillsLearned: appliedSkills(),
    resumeUrl: 'Harshit_Seth_Fullstack.pdf',
    resumeGpa: '8.9',
    resumeSummary: 'Frontend-focused developer with pixel-perfect design implementation and strong React accessibility practice.',
    certificates: certificateEvidence,
    projects: projectEvidence,
    links: {
      github: 'https://github.com/harshitsetheh-droid',
      linkedin: 'https://linkedin.com/in/harshitsetheh',
      email: 'harshitseth.work@gmail.com',
    },
  },
];

const seedOffCampusApps: OffCampusApplication[] = [
  {
    id: 'seed-off-neurospark',
    applicantName: 'Harshit Seth',
    email: 'harshitseth.work@gmail.com',
    location: 'Jodhpur, Rajasthan',
    collegeName: 'Institute of Technology, Jodhpur',
    degree: 'B.Tech Computer Science',
    graduationYear: '2027',
    appliedRole: 'ML Engineer Intern',
    matchScore: 91,
    applicationDate: 'Sep 22, 2026',
    status: 'applied',
    skills: ['Python', 'Machine Learning (AI/ML)', 'PostgreSQL'],
    resumeSummary: 'Built SynthAI (ML resume skill extractor) with 91% originality and an AI-verified ML specialization.',
    githubUrl: 'https://github.com/harshitsetheh-droid/synthai',
    projectsCount: 3,
  },
  {
    id: 'seed-off-technova',
    applicantName: 'Harshit Seth',
    email: 'harshitseth.work@gmail.com',
    location: 'Jodhpur, Rajasthan',
    collegeName: 'Institute of Technology, Jodhpur',
    degree: 'B.Tech Computer Science',
    graduationYear: '2027',
    appliedRole: 'Frontend Developer Intern',
    matchScore: 87,
    applicationDate: 'Sep 18, 2026',
    status: 'reviewing',
    skills: ['React', 'TypeScript', 'CSS'],
    resumeSummary: 'TrackNest full-stack tracking platform with 94% originality and 4/5 defense score.',
    githubUrl: 'https://github.com/harshitsetheh-droid/tracknest',
    projectsCount: 3,
  },
];

const seedCollegeSelected: CollegeSelectedStudentRecord[] = [
  {
    id: 'seed-sel-neha',
    studentName: 'Neha Agarwal',
    rollNumber: '22BCSE101',
    collegeName: 'Institute of Technology, Jodhpur',
    branch: 'CSE',
    cgpa: '9.2',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    companyName: 'TechNova Solutions',
    companyLogo: 'TN',
    role: 'Frontend Developer Intern',
    packageOffered: '₹35,000 / month',
    selectionYear: '2026',
    hiringType: 'Direct On-Campus Hire',
    selectionDate: 'Sep 27, 2026',
    verifiedSkills: ['React', 'TypeScript', 'JavaScript'],
    postingLocation: 'Bengaluru, Karnataka (Hybrid)',
    joiningDate: 'Jan 2027',
    isDirectCompanyTransmission: true,
  },
];

// ==========================================
// MAIN SEEDER
// ==========================================

export const seedDefaultDemoData = (): void => {
  try {
    const currentSkills = JSON.parse(localStorage.getItem('skillbridge_student_skills_v4') || '[]');
    if (!Array.isArray(currentSkills) || currentSkills.length === 0) {
      saveCurriculumCatalog(seedCurriculumList);
      saveStudentSkills(seedSkillsList);
    }

    const currentProjects = JSON.parse(localStorage.getItem('skillbridge_student_projects_v3') || '[]');
    if (!Array.isArray(currentProjects) || currentProjects.length === 0) {
      saveProjects(seedProjectsList);
    }

    const currentJobs = JSON.parse(localStorage.getItem('skillbridge_internships_v3') || '[]');
    if (!Array.isArray(currentJobs) || currentJobs.length === 0) {
      saveInternships(seedInternshipsList);
    }

    const currentResumes = JSON.parse(localStorage.getItem('skillbridge_student_resumes_v2') || '[]');
    if (!Array.isArray(currentResumes) || currentResumes.length === 0) {
      saveStoredResumes([seedResume]);
    }

    const currentCerts = JSON.parse(localStorage.getItem('skillbridge_student_certificates_v3') || '[]');
    if (!Array.isArray(currentCerts) || currentCerts.length === 0) {
      saveStudentCertificates(seedCertificatesList);
    }

    const currentDriveReqs = JSON.parse(localStorage.getItem('skillbridge_drive_requests_v1') || '[]');
    if (!Array.isArray(currentDriveReqs) || currentDriveReqs.length === 0) {
      saveDriveRequests(seedDriveRequests);
    }

    const currentSkillReqs = JSON.parse(localStorage.getItem('skillbridge_skill_requests_v2') || '[]');
    if (!Array.isArray(currentSkillReqs) || currentSkillReqs.length === 0) {
      saveSkillRequests(seedSkillRequests);
    }

    const currentApproaches = JSON.parse(localStorage.getItem('skillbridge_college_approach_requests_v1') || '[]');
    if (!Array.isArray(currentApproaches) || currentApproaches.length === 0) {
      saveCollegeApproachRequests(seedCollegeApproaches);
    }

    const currentBatchFb = JSON.parse(localStorage.getItem('skillbridge_company_to_college_feedback_v2') || '[]');
    if (!Array.isArray(currentBatchFb) || currentBatchFb.length === 0) {
      saveBatchFeedbackList(seedBatchFeedback);
    }

    const currentCandFb = JSON.parse(localStorage.getItem('skillbridge_candidate_feedback_v2') || '[]');
    if (!Array.isArray(currentCandFb) || currentCandFb.length === 0) {
      saveFeedbackList(seedCandidateFeedback);
    }

    const currentNotifs = JSON.parse(localStorage.getItem('skillbridge_notifications_v2') || '[]');
    if (!Array.isArray(currentNotifs) || currentNotifs.length === 0) {
      seedNotifications();
    }

    const currentSessions = JSON.parse(localStorage.getItem('skillbridge_user_sessions_v1') || '[]');
    if (!Array.isArray(currentSessions) || currentSessions.length === 0) {
      saveLoginSessions(seedSessions);
    }

    const currentApprovals = JSON.parse(localStorage.getItem('skillbridge_approval_store_v2') || '[]');
    if (!Array.isArray(currentApprovals) || currentApprovals.length === 0) {
      saveApprovalRecords(seedApprovalRecords);
    }

    // Daily quiz: default 6-day active streak
    const currentStreak = JSON.parse(localStorage.getItem('skillbridge_daily_streak_v2') || 'null');
    if (!currentStreak) {
      saveDailyStreakState({
        streakCount: 6,
        longestStreak: 12,
        lastCompletedDate: getYesterdayDateString(),
        lastAttemptDate: null,
        lastLoginDate: getTodayDateString(),
        todayCompleted: false,
        todayScore: null,
        todayCorrectCount: null,
        streakStatus: 'pending',
        retestAvailable: false,
        history: [],
      });
    }

    // Applications store (in-memory singleton: reload from storage after writes)
    const currentOnCampus = JSON.parse(localStorage.getItem('sb_on_campus_apps') || '[]');
    const currentOffCampus = JSON.parse(localStorage.getItem('sb_off_campus_apps') || '[]');
    const currentSelected = JSON.parse(localStorage.getItem('sb_college_selected') || '[]');
    if (!Array.isArray(currentOnCampus) || currentOnCampus.length === 0) {
      localStorage.setItem('sb_on_campus_apps', JSON.stringify(seedOnCampusApps));
    }
    if (!Array.isArray(currentOffCampus) || currentOffCampus.length === 0) {
      localStorage.setItem('sb_off_campus_apps', JSON.stringify(seedOffCampusApps));
    }
    if (!Array.isArray(currentSelected) || currentSelected.length === 0) {
      localStorage.setItem('sb_college_selected', JSON.stringify(seedCollegeSelected));
    }
    studentApplicationsStore.reloadAllFromStorage();

    // Improvement paths: one per company where a path exists
    const currentPaths = JSON.parse(localStorage.getItem('talentbridge_company_improvement_paths_v1') || '[]');
    if (!Array.isArray(currentPaths) || currentPaths.length === 0) {
      const eligibleJobs = seedInternshipsList.filter((j) => j.id === 'seed-job-cloudmatrix-backend' || j.id === 'seed-job-technova-frontend' || j.id === 'seed-job-innovate-sde');
      eligibleJobs.forEach((job) => {
        addCompanyImprovementPath(generateCompanyPathFromJob(job, seedSkillsList, seedProjectsList));
      });
    }
  } catch (e) {
    console.error('Failed to seed default demo data', e);
  }
};