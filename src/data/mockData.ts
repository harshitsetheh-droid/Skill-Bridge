import { 
  Skill, 
  Project, 
  Internship, 
  Candidate, 
  DepartmentGapData, 
  StudentReadinessRow, 
  FlaggedProjectRow, 
  PartnerCompany,
  CourseRecommendation,
  InstitutionStudent
} from '../types';

export type { InstitutionStudent };

export const initialStudentData = {
  name: 'Harshit Seth',
  email: 'harshitseth.work@gmail.com',
  username: 'harshitseth',
  branch: 'Computer Science',
  college: 'Institute of Technology, Jodhpur',
  year: 'Final Year (2026-27)',
  cgpa: '8.9',
  readinessScore: 86,
  stats: {
    skillsVerified: 10,
    activeApplications: 4,
    projectsReviewed: 3,
  },
  bio: 'Full-stack developer & AI enthusiast building verified, audit-ready projects. Focused on system design and production-grade engineering.',
  links: {
    github: 'https://github.com/harshitsetheh-droid',
    portfolio: 'https://harshitseth.dev',
    linkedin: 'https://linkedin.com/in/harshitsetheh',
  },
};

export const initialSkills: Skill[] = [];

export const initialProjects: Project[] = [];

export const initialInternships: Internship[] = [];

export const courseRecommendations: CourseRecommendation[] = [
  {
    id: 'rec-docker',
    title: 'Docker & Kubernetes Complete Guide',
    provider: 'Udemy',
    duration: '4 weeks',
    skillAddressed: 'Docker & Containers',
    level: 'Intermediate',
    matchBoost: 18,
    rating: 4.7,
    enrollUrl: 'https://udemy.com/course/docker-k8s',
    prescribedByCollege: 'Institute of Technology, Jodhpur',
    companyFeedbackSource: 'CloudMatrix',
    feedbackQuote: 'Top missing skill across the batch — hands-on containerization is mandatory.',
  },
  {
    id: 'rec-system-design',
    title: 'System Design Interview Course',
    provider: 'ByteByteGo',
    duration: '6 weeks',
    skillAddressed: 'System Design & High Availability',
    level: 'Advanced',
    matchBoost: 22,
    rating: 4.8,
    enrollUrl: 'https://bytebytego.com',
    prescribedByCollege: 'Institute of Technology, Jodhpur',
    companyFeedbackSource: 'TechNova Solutions',
    feedbackQuote: 'Candidates need stronger distributed-systems reasoning in final rounds.',
  },
  {
    id: 'rec-redis',
    title: 'Redis Deep Dive: Caching & Real-Time Systems',
    provider: 'PluralSight',
    duration: '3 weeks',
    skillAddressed: 'Redis',
    level: 'Intermediate',
    matchBoost: 15,
    rating: 4.6,
    companyFeedbackSource: 'CloudMatrix',
    feedbackQuote: 'Caches and queues used heavily in our stack.',
  },
  {
    id: 'rec-kubernetes',
    title: 'Certified Kubernetes Administrator (CKA) Prep',
    provider: 'The Linux Foundation',
    duration: '8 weeks',
    skillAddressed: 'Kubernetes',
    level: 'Advanced',
    matchBoost: 20,
    rating: 4.9,
    companyFeedbackSource: 'InnoMind AI',
    feedbackQuote: 'Container orchestration is the #1 missing skill for our infra roles.',
  },
];

export const initialCompanyData = {
  name: 'TechNova Solutions',
  tagline: 'Cloud & AI SaaS — building the next generation of developer productivity tools.',
  logo: 'TN',
  about: 'TechNova Solutions is a fast-growing cloud & AI SaaS company headquartered in Bengaluru. We build developer productivity and analytics platforms used by 40+ enterprises. Our campus hiring program focuses on verified, high-originality engineering talent.',
  recruitmentPhilosophy: 'We hire for verified competency, not credentials. Every candidate must demonstrate project originality, pass an AI code-logic defense, and prove required skills through auditable work.',
  highlights: [
    '8x growth in headcount over 2 years',
    'Hire-to-verify ratio: 94% of interns convert to PPO',
    'Dedicated mentorship budget of ₹50k per intern',
    'Strong remote + hybrid work culture',
  ],
  stats: {
    totalApplicants: 248,
    avgMatchScore: 84,
    verifiedCandidatesPercent: 73,
    activePostings: 4,
  }
};

export const initialCandidates: Candidate[] = [
  {
    id: 'cand-harshit',
    anonymousId: 'sb-cand-8841',
    name: 'Harshit Seth',
    rollNumber: '22BCSE104',
    college: 'Institute of Technology, Jodhpur',
    branch: 'CSE',
    year: '2027',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    matchScore: 94,
    topSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'System Design'],
    projectVerified: true,
    originalityScore: 92,
    logicQnAScore: 96,
    status: 'new',
    resumeHighlights: {
      gpa: '8.9',
      verifiedCount: 10,
      projectsCount: 2,
      summary: 'Full-stack developer with 2 audited flagship projects and 10 AI-verified skills.',
    },
    skillsBreakdown: [
      { name: 'React', score: 96, verified: true },
      { name: 'TypeScript', score: 88, verified: true },
      { name: 'Node.js', score: 90, verified: true },
      { name: 'PostgreSQL', score: 85, verified: true },
    ],
    links: {
      github: 'https://github.com/harshitsetheh-droid',
      linkedin: 'https://linkedin.com/in/harshitsetheh',
      portfolio: 'https://harshitseth.dev',
      email: 'harshitseth.work@gmail.com',
    },
  },
  {
    id: 'cand-neha',
    anonymousId: 'sb-cand-9102',
    name: 'Neha Agarwal',
    rollNumber: '22BCSE101',
    college: 'Institute of Technology, Jodhpur',
    branch: 'CSE',
    year: '2027',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    matchScore: 91,
    topSkills: ['React', 'Redux', 'JavaScript', 'Tailwind CSS'],
    projectVerified: true,
    originalityScore: 89,
    logicQnAScore: 94,
    status: 'shortlisted',
    resumeHighlights: {
      gpa: '9.2',
      verifiedCount: 8,
      projectsCount: 3,
      summary: 'Design-systems specialist with strong accessibility practice and DSA fundamentals.',
    },
    skillsBreakdown: [
      { name: 'React', score: 95, verified: true },
      { name: 'JavaScript', score: 93, verified: true },
      { name: 'CSS', score: 97, verified: true },
    ],
    links: {
      github: 'https://github.com/nehaagarwal',
      linkedin: 'https://linkedin.com/in/nehaagarwal',
      email: 'neha.agarwal@itj.ac.in',
    },
  },
  {
    id: 'cand-amank',
    anonymousId: 'sb-cand-7731',
    name: 'Aman Kumar',
    rollNumber: '22BCSE103',
    college: 'Institute of Technology, Jodhpur',
    branch: 'CSE',
    year: '2027',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    matchScore: 86,
    topSkills: ['Java', 'Spring Boot', 'MySQL', 'REST APIs'],
    projectVerified: true,
    originalityScore: 88,
    logicQnAScore: 90,
    status: 'new',
    resumeHighlights: {
      gpa: '8.4',
      verifiedCount: 7,
      projectsCount: 2,
      summary: 'Backend engineer with event-driven architecture and payment-systems exposure.',
    },
    skillsBreakdown: [
      { name: 'Java', score: 89, verified: true },
      { name: 'Spring Boot', score: 86, verified: true },
      { name: 'MySQL', score: 84, verified: true },
    ],
    links: {
      github: 'https://github.com/amank',
      linkedin: 'https://linkedin.com/in/amank',
      email: 'aman.k@itj.ac.in',
    },
  },
  {
    id: 'cand-sneha',
    anonymousId: 'sb-cand-6650',
    name: 'Sneha Patel',
    rollNumber: '22BCSE107',
    college: 'Institute of Technology, Jodhpur',
    branch: 'CSE',
    year: '2027',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    matchScore: 89,
    topSkills: ['Python', 'FastAPI', 'TensorFlow', 'NLP'],
    projectVerified: true,
    originalityScore: 90,
    logicQnAScore: 92,
    status: 'shortlisted',
    resumeHighlights: {
      gpa: '9.0',
      verifiedCount: 9,
      projectsCount: 3,
      summary: 'ML engineer with production NLP pipelines and strong model-evaluation discipline.',
    },
    skillsBreakdown: [
      { name: 'Python', score: 94, verified: true },
      { name: 'FastAPI', score: 88, verified: true },
      { name: 'TensorFlow', score: 85, verified: true },
    ],
    links: {
      github: 'https://github.com/snehap',
      linkedin: 'https://linkedin.com/in/snehap',
      email: 'sneha.p@itj.ac.in',
    },
  },
  {
    id: 'cand-priya',
    anonymousId: 'sb-cand-5519',
    name: 'Priya Verma',
    rollNumber: '22BCSE105',
    college: 'Institute of Technology, Jodhpur',
    branch: 'CSE',
    year: '2027',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    matchScore: 62,
    topSkills: ['Python', 'C++', 'MySQL'],
    projectVerified: false,
    originalityScore: 54,
    logicQnAScore: 48,
    status: 'new',
    resumeHighlights: {
      gpa: '7.9',
      verifiedCount: 3,
      projectsCount: 1,
      summary: 'Claims ML expertise but project originality and code defense need verification.',
    },
    skillsBreakdown: [
      { name: 'Python', score: 70, verified: false },
      { name: 'C++', score: 65, verified: false },
    ],
    links: {
      github: 'https://github.com/priyaverma',
      email: 'priya.v@itj.ac.in',
    },
  },
];

export const topMissingSkillsData = [
  { skill: 'Docker & Containers', count: 141, percentage: 57 },
  { skill: 'System Design & High Availability', count: 129, percentage: 52 },
  { skill: 'Kubernetes', count: 112, percentage: 45 },
  { skill: 'Redis & Caching', count: 96, percentage: 39 },
  { skill: 'GraphQL', count: 78, percentage: 31 },
];

export interface MissingSkillSegment {
  skill: string;
  count: number;
  applicantsInGroup: number;
  percentage: number;
}

export interface TalentSkillGapScope {
  key: string;
  label: string;
  applicants: number;
  skills: MissingSkillSegment[];
}

// Segmented missing-skill analytics: overall pool, per-college, and off-campus applicants
export const talentSkillGapData: {
  overall: TalentSkillGapScope;
  colleges: { name: string; scope: TalentSkillGapScope }[];
  offCampus: TalentSkillGapScope;
} = {
  overall: {
    key: 'overall',
    label: 'Overall Applicant Pool',
    applicants: 248,
    skills: topMissingSkillsData.map((s) => ({ skill: s.skill, count: s.count, applicantsInGroup: 248, percentage: s.percentage })),
  },
  colleges: [
    {
      name: 'Institute of Technology, Jodhpur',
      scope: {
        key: 'college-itj',
        label: 'Institute of Technology, Jodhpur',
        applicants: 88,
        skills: [
          { skill: 'Docker & Containers', count: 41, applicantsInGroup: 88, percentage: 47 },
          { skill: 'Kubernetes', count: 35, applicantsInGroup: 88, percentage: 40 },
          { skill: 'System Design & High Availability', count: 33, applicantsInGroup: 88, percentage: 38 },
          { skill: 'Redis & Caching', count: 24, applicantsInGroup: 88, percentage: 27 },
          { skill: 'GraphQL', count: 18, applicantsInGroup: 88, percentage: 20 },
        ],
      },
    },
    {
      name: 'ABC University',
      scope: {
        key: 'college-abc',
        label: 'ABC University',
        applicants: 61,
        skills: [
          { skill: 'System Design & High Availability', count: 40, applicantsInGroup: 61, percentage: 66 },
          { skill: 'Docker & Containers', count: 38, applicantsInGroup: 61, percentage: 62 },
          { skill: 'GraphQL', count: 27, applicantsInGroup: 61, percentage: 44 },
          { skill: 'Kubernetes', count: 25, applicantsInGroup: 61, percentage: 41 },
          { skill: 'Redis & Caching', count: 22, applicantsInGroup: 61, percentage: 36 },
        ],
      },
    },
    {
      name: 'XYZ Institute of Tech',
      scope: {
        key: 'college-xyz',
        label: 'XYZ Institute of Tech',
        applicants: 54,
        skills: [
          { skill: 'Kubernetes', count: 30, applicantsInGroup: 54, percentage: 56 },
          { skill: 'Docker & Containers', count: 29, applicantsInGroup: 54, percentage: 54 },
          { skill: 'System Design & High Availability', count: 27, applicantsInGroup: 54, percentage: 50 },
          { skill: 'Redis & Caching', count: 21, applicantsInGroup: 54, percentage: 39 },
          { skill: 'GraphQL', count: 15, applicantsInGroup: 54, percentage: 28 },
        ],
      },
    },
    {
      name: 'Global Engineering College',
      scope: {
        key: 'college-gec',
        label: 'Global Engineering College',
        applicants: 45,
        skills: [
          { skill: 'Redis & Caching', count: 29, applicantsInGroup: 45, percentage: 64 },
          { skill: 'System Design & High Availability', count: 29, applicantsInGroup: 45, percentage: 64 },
          { skill: 'Docker & Containers', count: 33, applicantsInGroup: 45, percentage: 73 },
          { skill: 'Kubernetes', count: 22, applicantsInGroup: 45, percentage: 49 },
          { skill: 'GraphQL', count: 18, applicantsInGroup: 45, percentage: 40 },
        ],
      },
    },
  ],
  offCampus: {
    key: 'off_campus',
    label: 'Off-Campus Pool',
    applicants: 96,
    skills: [
      { skill: 'System Design & High Availability', count: 57, applicantsInGroup: 96, percentage: 59 },
      { skill: 'Kubernetes', count: 52, applicantsInGroup: 96, percentage: 54 },
      { skill: 'Docker & Containers', count: 49, applicantsInGroup: 96, percentage: 51 },
      { skill: 'Redis & Caching', count: 40, applicantsInGroup: 96, percentage: 42 },
      { skill: 'GraphQL', count: 32, applicantsInGroup: 96, percentage: 33 },
    ],
  },
};

export const initialInstitutionData = {
  name: 'Institute of Technology, Jodhpur',
  accreditation: 'NAAC A+ • UGC Autonomous',
  stats: {
    totalStudents: 1984,
    placementReadyPercent: 72,
    activeJobPostings: 32,
    avgMatchScore: 81,
  },
  departments: ['CSE', 'AI & Data Science', 'ECE', 'Mechanical'],
};

export const departmentGapsData: DepartmentGapData[] = [
  {
    department: 'CSE',
    skills: [
      { name: 'Docker & Containers', curriculumCoverage: 22, industryDemand: 91, status: 'gap' },
      { name: 'System Design', curriculumCoverage: 35, industryDemand: 88, status: 'gap' },
      { name: 'React', curriculumCoverage: 78, industryDemand: 92, status: 'covered' },
      { name: 'Node.js', curriculumCoverage: 62, industryDemand: 85, status: 'moderate' },
      { name: 'Kubernetes', curriculumCoverage: 12, industryDemand: 76, status: 'gap' },
    ],
  },
  {
    department: 'AI & Data Science',
    skills: [
      { name: 'Machine Learning (AI/ML)', curriculumCoverage: 72, industryDemand: 95, status: 'moderate' },
      { name: 'LLM Engineering', curriculumCoverage: 18, industryDemand: 89, status: 'gap' },
      { name: 'PyTorch', curriculumCoverage: 48, industryDemand: 86, status: 'moderate' },
      { name: 'FastAPI', curriculumCoverage: 40, industryDemand: 70, status: 'moderate' },
      { name: 'MLOps', curriculumCoverage: 15, industryDemand: 78, status: 'gap' },
    ],
  },
  {
    department: 'ECE',
    skills: [
      { name: 'Embedded C', curriculumCoverage: 80, industryDemand: 72, status: 'covered' },
      { name: 'IoT Protocols', curriculumCoverage: 55, industryDemand: 74, status: 'moderate' },
      { name: 'Digital Signal Processing', curriculumCoverage: 70, industryDemand: 60, status: 'moderate' },
      { name: 'Python', curriculumCoverage: 42, industryDemand: 80, status: 'moderate' },
    ],
  },
  {
    department: 'Mechanical',
    skills: [
      { name: 'CAD/CAM', curriculumCoverage: 75, industryDemand: 66, status: 'moderate' },
      { name: 'CFD Simulation', curriculumCoverage: 45, industryDemand: 58, status: 'moderate' },
      { name: 'Python for Automation', curriculumCoverage: 20, industryDemand: 52, status: 'gap' },
    ],
  },
];

export const studentReadinessRows: StudentReadinessRow[] = [
  { id: 'rd-harshit', name: 'Harshit Seth', email: 'harshitseth.work@gmail.com', branch: 'CSE', completeness: 92, verifiedSkillsCount: 10, status: 'High', readinessScore: 86 },
  { id: 'rd-neha', name: 'Neha Agarwal', email: 'neha.agarwal@itj.ac.in', branch: 'CSE', completeness: 88, verifiedSkillsCount: 8, status: 'High', readinessScore: 84 },
  { id: 'rd-sneha', name: 'Sneha Patel', email: 'sneha.p@itj.ac.in', branch: 'CSE', completeness: 85, verifiedSkillsCount: 9, status: 'High', readinessScore: 82 },
  { id: 'rd-aman', name: 'Aman Kumar', email: 'aman.k@itj.ac.in', branch: 'CSE', completeness: 78, verifiedSkillsCount: 7, status: 'Medium', readinessScore: 74 },
  { id: 'rd-rohit', name: 'Rohit Singh', email: 'rohit.s@itj.ac.in', branch: 'ECE', completeness: 64, verifiedSkillsCount: 5, status: 'Medium', readinessScore: 61 },
  { id: 'rd-priya', name: 'Priya Verma', email: 'priya.v@itj.ac.in', branch: 'CSE', completeness: 41, verifiedSkillsCount: 3, status: 'Action Needed', readinessScore: 38 },
  { id: 'rd-arjun', name: 'Arjun Mehta', email: 'arjun.m@itj.ac.in', branch: 'Mechanical', completeness: 47, verifiedSkillsCount: 4, status: 'Action Needed', readinessScore: 44 },
];

export const flaggedProjectsRows: FlaggedProjectRow[] = [
  { id: 'fg-1', studentName: 'Rahul Sharma', branch: 'CSE', projectTitle: 'E-Commerce Backend Fork', originalityScore: 42, flagReason: 'AST code similarity 78% with existing public repo; copied solution structure.', submissionDate: 'Sep 10, 2026', status: 'Flagged' },
  { id: 'fg-2', studentName: 'Aman Yadav', branch: 'IT', projectTitle: 'Micro-Agent Platform', originalityScore: 48, flagReason: 'Credentialed with a fake certificate — issuer hash failed institutional verification.', submissionDate: 'Sep 12, 2026', status: 'Under Review' },
  { id: 'fg-3', studentName: 'Harshit Seth', branch: 'CSE', projectTitle: 'Legacy Static Portfolio', originalityScore: 38, flagReason: 'Heavy similarity to public template; ~38% original only.', submissionDate: 'Sep 15, 2026', status: 'Under Review' },
  { id: 'fg-4', studentName: 'Karan Patel', branch: 'ECE', projectTitle: 'IoT Sensor Dashboard', originalityScore: 61, flagReason: 'Duplicate of prior batch submission; timeline metadata inconsistent.', submissionDate: 'Sep 18, 2026', status: 'Cleared' },
];

export const partnerCompanies: PartnerCompany[] = [
  { id: 'pc-1', name: 'TechNova Solutions', logo: 'TN', industry: 'Cloud & AI SaaS', jobsPosted: 6, studentsShortlisted: 42, hiringRate: 88, trend: [10, 18, 22, 30, 35, 42] },
  { id: 'pc-2', name: 'DataHub Solutions', logo: 'DH', industry: 'Analytics & FinTech', jobsPosted: 4, studentsShortlisted: 28, hiringRate: 82, trend: [8, 14, 17, 21, 25, 28] },
  { id: 'pc-3', name: 'CodeSoft Systems', logo: 'CS', industry: 'Distributed Computing', jobsPosted: 5, studentsShortlisted: 34, hiringRate: 79, trend: [12, 16, 20, 26, 30, 34] },
  { id: 'pc-4', name: 'InnoMind AI', logo: 'IM', industry: 'Generative AI & LLMs', jobsPosted: 8, studentsShortlisted: 19, hiringRate: 91, trend: [4, 8, 11, 14, 17, 19] },
];

export const demandVsSupplySkills = [
  { skill: 'Docker & Containers', demand: 91, supply: 24 },
  { skill: 'React', demand: 92, supply: 74 },
  { skill: 'System Design', demand: 88, supply: 32 },
  { skill: 'Node.js', demand: 85, supply: 58 },
  { skill: 'Machine Learning (AI/ML)', demand: 95, supply: 55 },
  { skill: 'Kubernetes', demand: 76, supply: 15 },
  { skill: 'Python', demand: 90, supply: 68 },
];

export const departmentsList = ['CSE', 'ECE', 'Mechanical', 'AI & Data Science'];

export const curriculumHeatmap = [
  { row: 'React', columns: { 'CSE': 82, 'ECE': 40, 'Mechanical': 12, 'AI': 55 } },
  { row: 'Python', columns: { 'CSE': 88, 'ECE': 52, 'Mechanical': 20, 'AI': 96 } },
  { row: 'Docker & Containers', columns: { 'CSE': 22, 'ECE': 8, 'Mechanical': 5, 'AI': 15 } },
  { row: 'System Design', columns: { 'CSE': 35, 'ECE': 18, 'Mechanical': 6, 'AI': 28 } },
  { row: 'Kubernetes', columns: { 'CSE': 12, 'ECE': 4, 'Mechanical': 2, 'AI': 10 } },
  { row: 'Machine Learning (AI/ML)', columns: { 'CSE': 60, 'ECE': 25, 'Mechanical': 10, 'AI': 92 } },
];

export const initialInstitutionStudents: InstitutionStudent[] = [
  {
    id: 'ise-harshit',
    name: 'Harshit Seth',
    rollNumber: '22BCSE104',
    branch: 'CSE',
    cgpa: '8.9',
    readinessPercent: 86,
    verifiedSkillsCount: 10,
    projectsCount: 2,
    status: 'High',
    email: 'harshitseth.work@gmail.com',
    phone: '+91 98765 43210',
    batch: '2027',
    semester: '7th',
    atsResumeScore: 92,
    codeLogicScore: 96,
    integrityStatus: 'Verified',
    skillsLearned: [
      { name: 'React', category: 'Frontend', proficiency: 96, level: 'Advanced', verified: true, verifiedDate: 'Sep 2026', verifiedMethod: 'AI Logic Q&A Defense', checkpointsCompleted: 8, totalCheckpoints: 8 },
      { name: 'TypeScript', category: 'Frontend', proficiency: 88, level: 'Advanced', verified: true, verifiedDate: 'Sep 2026', verifiedMethod: 'AI Logic Q&A Defense', checkpointsCompleted: 6, totalCheckpoints: 7 },
      { name: 'Node.js', category: 'Backend', proficiency: 90, level: 'Advanced', verified: true, verifiedDate: 'Sep 2026', verifiedMethod: 'AST Code Audit', checkpointsCompleted: 6, totalCheckpoints: 7 },
      { name: 'PostgreSQL', category: 'Database', proficiency: 85, level: 'Advanced', verified: true, verifiedDate: 'Sep 2026', verifiedMethod: 'Quiz Assessment', checkpointsCompleted: 6, totalCheckpoints: 7 },
      { name: 'Python', category: 'Backend', proficiency: 92, level: 'Advanced', verified: true, verifiedDate: 'Aug 2026', verifiedMethod: 'AI Logic Q&A Defense', checkpointsCompleted: 7, totalCheckpoints: 7 },
      { name: 'Machine Learning (AI/ML)', category: 'AI / Data', proficiency: 83, level: 'Intermediate', verified: true, verifiedDate: 'Aug 2026', verifiedMethod: 'AST Code Audit', checkpointsCompleted: 6, totalCheckpoints: 7 },
      { name: 'Docker & Containers', category: 'DevOps', proficiency: 48, level: 'Intermediate', verified: false, verifiedMethod: 'Self Claimed', checkpointsCompleted: 2, totalCheckpoints: 6 },
      { name: 'Redis', category: 'Database', proficiency: 40, level: 'Intermediate', verified: false, verifiedMethod: 'Self Claimed', checkpointsCompleted: 1, totalCheckpoints: 4 },
      { name: 'System Design & High Availability', category: 'Core CS', proficiency: 52, level: 'Intermediate', verified: false, verifiedMethod: 'Self Claimed', checkpointsCompleted: 2, totalCheckpoints: 5 },
    ],
    projects: [
      { id: 'ise-prj-1', title: 'TrackNest — Full-Stack Placement Tracker', techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'], originalityScore: 94, logicDefenseScore: 95, status: 'passed', repoUrl: 'https://github.com/harshitsetheh-droid/tracknest' },
      { id: 'ise-prj-2', title: 'SynthAI — ML Resume Skill Extractor', techStack: ['Python', 'FastAPI', 'Machine Learning (AI/ML)'], originalityScore: 91, logicDefenseScore: 93, status: 'passed', repoUrl: 'https://github.com/harshitsetheh-droid/synthai' },
    ],
    shortlistedCompanies: ['TechNova Solutions', 'NeuroSpark AI'],
    recommendedFocus: ['Docker & Containers', 'System Design', 'Redis'],
  },
  {
    id: 'ise-neha',
    name: 'Neha Agarwal',
    rollNumber: '22BCSE101',
    branch: 'CSE',
    cgpa: '9.2',
    readinessPercent: 84,
    verifiedSkillsCount: 8,
    projectsCount: 3,
    status: 'High',
    email: 'neha.agarwal@itj.ac.in',
    phone: '+91 91234 56780',
    batch: '2027',
    semester: '7th',
    atsResumeScore: 90,
    codeLogicScore: 94,
    integrityStatus: 'Verified',
    skillsLearned: [
      { name: 'React', category: 'Frontend', proficiency: 95, level: 'Advanced', verified: true, verifiedDate: 'Sep 2026', verifiedMethod: 'AI Logic Q&A Defense', checkpointsCompleted: 8, totalCheckpoints: 8 },
      { name: 'JavaScript', category: 'Frontend', proficiency: 93, level: 'Advanced', verified: true, verifiedDate: 'Sep 2026', verifiedMethod: 'AI Logic Q&A Defense', checkpointsCompleted: 8, totalCheckpoints: 8 },
      { name: 'CSS', category: 'Frontend', proficiency: 97, level: 'Advanced', verified: true, verifiedDate: 'Sep 2026', verifiedMethod: 'AST Code Audit', checkpointsCompleted: 7, totalCheckpoints: 7 },
      { name: 'Tailwind CSS', category: 'Frontend', proficiency: 92, level: 'Advanced', verified: true, verifiedDate: 'Sep 2026', verifiedMethod: 'Quiz Assessment', checkpointsCompleted: 5, totalCheckpoints: 5 },
    ],
    projects: [
      { id: 'ise-prj-3', title: 'A11y Design System Library', techStack: ['React', 'TypeScript', 'CSS'], originalityScore: 89, logicDefenseScore: 94, status: 'passed', repoUrl: 'https://github.com/nehaagarwal/a11y-library' },
      { id: 'ise-prj-4', title: 'E-Commerce Storefront', techStack: ['React', 'Redux', 'Tailwind'], originalityScore: 86, logicDefenseScore: 90, status: 'passed', repoUrl: 'https://github.com/nehaagarwal/storefront' },
    ],
    shortlistedCompanies: ['TechNova Solutions'],
    recommendedFocus: ['Node.js', 'System Design'],
  },
  {
    id: 'ise-sneha',
    name: 'Sneha Patel',
    rollNumber: '22BCSE107',
    branch: 'CSE',
    cgpa: '9.0',
    readinessPercent: 82,
    verifiedSkillsCount: 9,
    projectsCount: 3,
    status: 'High',
    email: 'sneha.p@itj.ac.in',
    phone: '+91 98123 45678',
    batch: '2027',
    semester: '7th',
    atsResumeScore: 94,
    codeLogicScore: 92,
    integrityStatus: 'Verified',
    skillsLearned: [
      { name: 'Python', category: 'Backend', proficiency: 94, level: 'Advanced', verified: true, verifiedDate: 'Sep 2026', verifiedMethod: 'AI Logic Q&A Defense', checkpointsCompleted: 7, totalCheckpoints: 7 },
      { name: 'FastAPI', category: 'Backend', proficiency: 88, level: 'Advanced', verified: true, verifiedDate: 'Sep 2026', verifiedMethod: 'AST Code Audit', checkpointsCompleted: 6, totalCheckpoints: 6 },
      { name: 'Machine Learning (AI/ML)', category: 'AI / Data', proficiency: 91, level: 'Advanced', verified: true, verifiedDate: 'Sep 2026', verifiedMethod: 'AI Logic Q&A Defense', checkpointsCompleted: 7, totalCheckpoints: 7 },
      { name: 'TensorFlow', category: 'AI / Data', proficiency: 85, level: 'Advanced', verified: true, verifiedDate: 'Aug 2026', verifiedMethod: 'Quiz Assessment', checkpointsCompleted: 5, totalCheckpoints: 6 },
    ],
    projects: [
      { id: 'ise-prj-5', title: 'NLP Sentiment Engine', techStack: ['Python', 'TensorFlow', 'FastAPI'], originalityScore: 91, logicDefenseScore: 93, status: 'passed', repoUrl: 'https://github.com/snehap/nlp-engine' },
      { id: 'ise-prj-6', title: 'Time Series Forecasting API', techStack: ['Python', 'FastAPI', 'PostgreSQL'], originalityScore: 88, logicDefenseScore: 90, status: 'passed', repoUrl: 'https://github.com/snehap/ts-forecast' },
    ],
    shortlistedCompanies: ['NeuroSpark AI', 'InnoMind AI'],
    recommendedFocus: ['MLOps', 'Docker'],
  },
  {
    id: 'ise-aman',
    name: 'Aman Kumar',
    rollNumber: '22BCSE103',
    branch: 'CSE',
    cgpa: '8.4',
    readinessPercent: 74,
    verifiedSkillsCount: 7,
    projectsCount: 2,
    status: 'Medium',
    email: 'aman.k@itj.ac.in',
    phone: '+91 90123 45671',
    batch: '2027',
    semester: '7th',
    atsResumeScore: 82,
    codeLogicScore: 90,
    integrityStatus: 'Verified',
    skillsLearned: [
      { name: 'Java', category: 'Backend', proficiency: 89, level: 'Advanced', verified: true, verifiedDate: 'Sep 2026', verifiedMethod: 'AI Logic Q&A Defense', checkpointsCompleted: 7, totalCheckpoints: 8 },
      { name: 'Spring Boot', category: 'Backend', proficiency: 86, level: 'Advanced', verified: true, verifiedDate: 'Sep 2026', verifiedMethod: 'AST Code Audit', checkpointsCompleted: 6, totalCheckpoints: 7 },
      { name: 'MySQL', category: 'Database', proficiency: 84, level: 'Advanced', verified: true, verifiedDate: 'Sep 2026', verifiedMethod: 'Quiz Assessment', checkpointsCompleted: 6, totalCheckpoints: 7 },
      { name: 'Kafka', category: 'Core CS', proficiency: 61, level: 'Intermediate', verified: true, verifiedDate: 'Aug 2026', verifiedMethod: 'AI Logic Q&A Defense', checkpointsCompleted: 4, totalCheckpoints: 6 },
      { name: 'HongChaQue', category: 'DevOps', proficiency: 30, level: 'Beginner', verified: false, verifiedMethod: 'Self Claimed', checkpointsCompleted: 1, totalCheckpoints: 4 },
    ],
    projects: [
      { id: 'ise-prj-7', title: 'Event-Driven Payment System', techStack: ['Java', 'Spring Boot', 'Kafka', 'MySQL'], originalityScore: 88, logicDefenseScore: 91, status: 'passed', repoUrl: 'https://github.com/amank/payment-system' },
    ],
    shortlistedCompanies: ['CodeSoft Systems'],
    recommendedFocus: ['Docker', 'System Design'],
  },
  {
    id: 'ise-priya',
    name: 'Priya Verma',
    rollNumber: '22BCSE105',
    branch: 'CSE',
    cgpa: '7.9',
    readinessPercent: 38,
    verifiedSkillsCount: 3,
    projectsCount: 1,
    status: 'Action Needed',
    email: 'priya.v@itj.ac.in',
    phone: '+91 90012 34562',
    batch: '2027',
    semester: '7th',
    atsResumeScore: 55,
    codeLogicScore: 48,
    integrityStatus: 'Flagged',
    skillsLearned: [
      { name: 'Python', category: 'Backend', proficiency: 55, level: 'Intermediate', verified: false, verifiedMethod: 'Self Claimed', checkpointsCompleted: 3, totalCheckpoints: 7 },
      { name: 'C++', category: 'Core CS', proficiency: 50, level: 'Intermediate', verified: false, verifiedMethod: 'Self Claimed', checkpointsCompleted: 2, totalCheckpoints: 6 },
      { name: 'Machine Learning (AI/ML)', category: 'AI / Data', proficiency: 40, level: 'Beginner', verified: false, verifiedMethod: 'Self Claimed', checkpointsCompleted: 1, totalCheckpoints: 6 },
    ],
    projects: [
      { id: 'ise-prj-8', title: 'ML Playground Demo', techStack: ['Python'], originalityScore: 45, logicDefenseScore: 35, status: 'flagged', repoUrl: 'https://github.com/priyaverma/playground' },
    ],
    shortlistedCompanies: [],
    recommendedFocus: ['Project Defense', 'Skill Verification', 'Originality'],
  },
  {
    id: 'ise-rohit',
    name: 'Rohit Singh',
    rollNumber: '22BECE101',
    branch: 'ECE',
    cgpa: '7.6',
    readinessPercent: 61,
    verifiedSkillsCount: 5,
    projectsCount: 2,
    status: 'Medium',
    email: 'rohit.s@itj.ac.in',
    phone: '+91 91123 45789',
    batch: '2027',
    semester: '7th',
    atsResumeScore: 70,
    codeLogicScore: 72,
    integrityStatus: 'Verified',
    skillsLearned: [
      { name: 'Embedded C', category: 'Core CS', proficiency: 82, level: 'Advanced', verified: true, verifiedDate: 'Sep 2026', verifiedMethod: 'AI Logic Q&A Defense', checkpointsCompleted: 6, totalCheckpoints: 7 },
      { name: 'IoT Protocols', category: 'Core CS', proficiency: 74, level: 'Intermediate', verified: true, verifiedDate: 'Sep 2026', verifiedMethod: 'AST Code Audit', checkpointsCompleted: 4, totalCheckpoints: 6 },
      { name: 'Python', category: 'Backend', proficiency: 60, level: 'Intermediate', verified: true, verifiedDate: 'Aug 2026', verifiedMethod: 'Quiz Assessment', checkpointsCompleted: 4, totalCheckpoints: 7 },
    ],
    projects: [
      { id: 'ise-prj-9', title: 'IoT Water Monitoring Node', techStack: ['Embedded C', 'MQTT', 'Python'], originalityScore: 79, logicDefenseScore: 80, status: 'passed', repoUrl: 'https://github.com/rohits/iot-water' },
    ],
    shortlistedCompanies: [],
    recommendedFocus: ['Docker', 'System Design'],
  },
  {
    id: 'ise-arjun',
    name: 'Arjun Mehta',
    rollNumber: '22BMECH101',
    branch: 'Mechanical',
    cgpa: '7.4',
    readinessPercent: 44,
    verifiedSkillsCount: 4,
    projectsCount: 1,
    status: 'Action Needed',
    email: 'arjun.m@itj.ac.in',
    phone: '+91 92123 45698',
    batch: '2027',
    semester: '7th',
    atsResumeScore: 62,
    codeLogicScore: 58,
    integrityStatus: 'Verified',
    skillsLearned: [
      { name: 'CAD/CAM', category: 'Core CS', proficiency: 75, level: 'Intermediate', verified: true, verifiedDate: 'Aug 2026', verifiedMethod: 'Quiz Assessment', checkpointsCompleted: 5, totalCheckpoints: 7 },
      { name: 'CFD Simulation', category: 'Core CS', proficiency: 64, level: 'Intermediate', verified: true, verifiedDate: 'Aug 2026', verifiedMethod: 'AI Logic Q&A Defense', checkpointsCompleted: 4, totalCheckpoints: 6 },
      { name: 'Python', category: 'Backend', proficiency: 35, level: 'Beginner', verified: false, verifiedMethod: 'Self Claimed', checkpointsCompleted: 2, totalCheckpoints: 7 },
    ],
    projects: [
      { id: 'ise-prj-10', title: 'Heat Exchanger CFD Study', techStack: ['Ansys', 'CFD'], originalityScore: 71, logicDefenseScore: 68, status: 'passed', repoUrl: 'https://github.com/arjunm/cfd-study' },
    ],
    shortlistedCompanies: [],
    recommendedFocus: ['Python', 'Project Defense'],
  },
];

export const partnerCompaniesList = partnerCompanies;