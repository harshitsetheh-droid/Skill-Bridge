// Shared admin types + seed data so the Admin views and the Sidebar badges read the SAME source.

export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  college: string;
  degree: string;
  cgpa: string;
  skillsVerified: number;
  skillsList: string[];
  originalityScore: number;
  isDelisted: boolean;
  delistReason?: string;
  riskStatus: 'clean' | 'suspicious' | 'delisted';
  flagReason?: string;
  riskType?: 'ast_plagiarism' | 'fake_cert' | 'resume_inflation' | 'bot_activity';
  avatar: string;
  githubRepo?: string;
  resumeAtsScore: number;
  codeDefensePassed: number;
  codeDefenseTotal: number;
}

export interface CompanyListing {
  id: string;
  name: string;
  industry: string;
  email: string;
  activeJobs: number;
  totalHired: number;
  status: 'Active' | 'Pending Approval' | 'Delisted';
  delistReason?: string;
  location: string;
  registeredDate: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  applicationsCount: number;
  status: 'Active (Direct Live)' | 'Closed';
  stipend: string;
  postedDate: string;
  location: string;
  skillsRequired: string[];
}

export interface UniversityRecord {
  id: string;
  name: string;
  tpoHead: string;
  email: string;
  state: string;
  studentsCount: number;
  skillGapLevel: 'High' | 'Medium' | 'Low';
  primaryGaps: string[];
  status: 'Active' | 'Pending Approval' | 'Delisted';
  delistReason?: string;
  appliedDate: string;
  nirfRank?: number;
  accreditation: string;
}

export const adminStudentsSeed: StudentRecord[] = [
  {
    id: 'STU101',
    name: 'Harshit Seth',
    email: 'harshit.s@itj.ac.in',
    college: 'MBM University, Jodhpur',
    degree: 'B.Tech CSE 2026',
    cgpa: '9.2',
    skillsVerified: 12,
    skillsList: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'System Design', 'TypeScript', 'Redis', 'Python'],
    originalityScore: 94,
    isDelisted: false,
    riskStatus: 'clean',
    avatar: 'HS',
    githubRepo: 'github.com/harshitseth/cloud-cache-proxy',
    resumeAtsScore: 88,
    codeDefensePassed: 5,
    codeDefenseTotal: 5,
  },
  {
    id: 'STU102',
    name: 'Rahul Sharma',
    email: 'rahul.s@abc.edu',
    college: 'ABC University',
    degree: 'B.Tech IT 2025',
    cgpa: '7.8',
    skillsVerified: 6,
    skillsList: ['HTML', 'CSS', 'JavaScript', 'Django'],
    originalityScore: 42,
    isDelisted: false,
    riskStatus: 'suspicious',
    riskType: 'ast_plagiarism',
    flagReason: 'AST code similarity 78% with existing public repo; copied solution structure and variable names altered.',
    avatar: 'RS',
    githubRepo: 'github.com/rahul-s/e-commerce-backend-fork',
    resumeAtsScore: 62,
    codeDefensePassed: 1,
    codeDefenseTotal: 4,
  },
  {
    id: 'STU103',
    name: 'Aman Kumar',
    email: 'aman.k@xyz.ac.in',
    college: 'XYZ Institute of Tech',
    degree: 'B.Tech CSE 2026',
    cgpa: '8.4',
    skillsVerified: 8,
    skillsList: ['Java', 'Spring Boot', 'MySQL', 'Kafka', 'REST APIs'],
    originalityScore: 88,
    isDelisted: false,
    riskStatus: 'clean',
    avatar: 'AK',
    githubRepo: 'github.com/amank/event-driven-payment',
    resumeAtsScore: 82,
    codeDefensePassed: 4,
    codeDefenseTotal: 4,
  },
  {
    id: 'STU104',
    name: 'Neha Singh',
    email: 'neha.singh@gec.edu',
    college: 'Global Engineering College',
    degree: 'B.Tech ECE 2025',
    cgpa: '8.9',
    skillsVerified: 9,
    skillsList: ['Python', 'FastAPI', 'Pandas', 'NumPy', 'TensorFlow Basics'],
    originalityScore: 91,
    isDelisted: false,
    riskStatus: 'clean',
    avatar: 'NS',
    githubRepo: 'github.com/nehasingh/iot-telemetry-engine',
    resumeAtsScore: 90,
    codeDefensePassed: 4,
    codeDefenseTotal: 4,
  },
  {
    id: 'STU105',
    name: 'Priya Verma',
    email: 'priya.v@pqr.ac.in',
    college: 'PQR University',
    degree: 'MCA 2025',
    cgpa: '7.4',
    skillsVerified: 4,
    skillsList: ['Python', 'C++'],
    originalityScore: 54,
    isDelisted: true,
    delistReason: 'Delisted by Admin: Self-claimed expert in PyTorch with zero commits & failed live defense challenge 3 times.',
    riskStatus: 'delisted',
    riskType: 'resume_inflation',
    flagReason: 'Skill defense failed 3 times; self-claimed expert in PyTorch without repo or demonstrable code.',
    avatar: 'PV',
    githubRepo: 'github.com/priyaverma/empty-playground',
    resumeAtsScore: 55,
    codeDefensePassed: 0,
    codeDefenseTotal: 3,
  },
  {
    id: 'STU106',
    name: 'Aman Yadav',
    email: 'aman.y@lmn.edu',
    college: 'LMN Technical University',
    degree: 'B.Tech CSE 2026',
    cgpa: '6.9',
    skillsVerified: 5,
    skillsList: ['Go', 'Docker', 'Linux'],
    originalityScore: 48,
    isDelisted: false,
    riskStatus: 'suspicious',
    riskType: 'fake_cert',
    flagReason: 'Fake certificate suspected: issuer cryptographic SHA-256 hash failed institutional verification check.',
    avatar: 'AY',
    githubRepo: 'github.com/ayadav/micro-agent',
    resumeAtsScore: 58,
    codeDefensePassed: 2,
    codeDefenseTotal: 4,
  },
  {
    id: 'STU107',
    name: 'Sneha Patel',
    email: 'sneha.p@itj.ac.in',
    college: 'MBM University, Jodhpur',
    degree: 'B.Tech CSE 2026',
    cgpa: '9.5',
    skillsVerified: 11,
    skillsList: ['Rust', 'WebAssembly', 'C++', 'Algorithms', 'Distributed Systems'],
    originalityScore: 96,
    isDelisted: false,
    riskStatus: 'clean',
    avatar: 'SP',
    githubRepo: 'github.com/snehap/wasm-matrix-engine',
    resumeAtsScore: 94,
    codeDefensePassed: 6,
    codeDefenseTotal: 6,
  },
];

export const adminCompaniesSeed: CompanyListing[] = [
  { id: 'COM1', name: 'TechNova Solutions', industry: 'Cloud & AI SaaS', email: 'talent@technova.com', activeJobs: 6, totalHired: 42, status: 'Active', location: 'Bengaluru / Remote', registeredDate: '05 Jan 2025' },
  { id: 'COM2', name: 'DataHub Solutions', industry: 'Analytics & FinTech', email: 'recruiter@datahub.io', activeJobs: 4, totalHired: 28, status: 'Active', location: 'Hyderabad', registeredDate: '18 Jan 2025' },
  { id: 'COM3', name: 'DesignCraft Studios', industry: 'Product & UI/UX', email: 'jobs@designcraft.com', activeJobs: 3, totalHired: 15, status: 'Active', location: 'Mumbai', registeredDate: '22 Jan 2025' },
  { id: 'COM4', name: 'CodeSoft Systems', industry: 'Distributed Computing', email: 'careers@codesoft.org', activeJobs: 5, totalHired: 34, status: 'Active', location: 'Pune', registeredDate: '10 Feb 2025' },
  { id: 'COM5', name: 'InnoMind AI', industry: 'Generative AI & LLMs', email: 'hiring@innomind.ai', activeJobs: 8, totalHired: 19, status: 'Active', location: 'Bengaluru', registeredDate: '28 Feb 2025' },
  { id: 'COM6', name: 'ZetaEdge Technologies', industry: 'Cybersecurity & Web3', email: 'hr@zetaedge.tech', activeJobs: 2, totalHired: 8, status: 'Pending Approval', location: 'Noida', registeredDate: 'Today 10:45' },
  { id: 'COM7', name: 'CloudScale Corp', industry: 'Infrastructure & SRE', email: 'ops@cloudscale.net', activeJobs: 1, totalHired: 0, status: 'Pending Approval', location: 'Gurugram', registeredDate: 'Yesterday 14:20' },
];

export const adminJobsSeed: JobListing[] = [
  { id: 'JOB1', title: 'Frontend Developer Intern', company: 'TechNova Solutions', applicationsCount: 91, status: 'Active (Direct Live)', stipend: '₹40,000/mo', postedDate: '15 May 2025', location: 'Remote', skillsRequired: ['React', 'TypeScript', 'Tailwind'] },
  { id: 'JOB2', title: 'Data Analyst Intern', company: 'DataHub Solutions', applicationsCount: 64, status: 'Active (Direct Live)', stipend: '₹35,000/mo', postedDate: '18 May 2025', location: 'Hyderabad', skillsRequired: ['SQL', 'Python', 'PowerBI'] },
  { id: 'JOB3', title: 'UI/UX Design Intern', company: 'DesignCraft Studios', applicationsCount: 53, status: 'Active (Direct Live)', stipend: '₹30,000/mo', postedDate: '20 May 2025', location: 'Mumbai', skillsRequired: ['Figma', 'Prototyping', 'Design Systems'] },
  { id: 'JOB4', title: 'Backend Developer Intern', company: 'CodeSoft Systems', applicationsCount: 48, status: 'Active (Direct Live)', stipend: '₹45,000/mo', postedDate: '22 May 2025', location: 'Pune', skillsRequired: ['Node.js', 'PostgreSQL', 'Docker'] },
  { id: 'JOB5', title: 'AI/ML Intern', company: 'InnoMind AI', applicationsCount: 37, status: 'Active (Direct Live)', stipend: '₹50,000/mo', postedDate: '24 May 2025', location: 'Bengaluru', skillsRequired: ['PyTorch', 'FastAPI', 'LangChain'] },
];

export const adminUniversitiesSeed: UniversityRecord[] = [
  { id: 'UNI1', name: 'ABC University', tpoHead: 'Dr. R.K. Verma', email: 'tpo@abc.edu', state: 'Delhi NCR', studentsCount: 2450, skillGapLevel: 'High', primaryGaps: ['Distributed Systems', 'Cloud DevOps', 'Docker'], status: 'Active', appliedDate: '12 Jan 2025', nirfRank: 32, accreditation: 'NAAC A++' },
  { id: 'UNI2', name: 'XYZ Institute of Tech', tpoHead: 'Prof. Sunita Rao', email: 'tpo@xyz.ac.in', state: 'Karnataka', studentsCount: 1980, skillGapLevel: 'Medium', primaryGaps: ['TypeScript', 'GraphQL', 'Next.js'], status: 'Active', appliedDate: '15 Jan 2025', nirfRank: 18, accreditation: 'NAAC A+' },
  { id: 'UNI3', name: 'Global Engineering College', tpoHead: 'Dr. Alok Nath', email: 'placements@gec.edu', state: 'Maharashtra', studentsCount: 1670, skillGapLevel: 'Medium', primaryGaps: ['Microservices', 'FastAPI'], status: 'Active', appliedDate: '01 Feb 2025', nirfRank: 45, accreditation: 'NAAC A' },
  { id: 'UNI4', name: 'PQR University', tpoHead: 'Dr. Meena Iyer', email: 'tpo@pqr.ac.in', state: 'Tamil Nadu', studentsCount: 1240, skillGapLevel: 'High', primaryGaps: ['System Design', 'Kafka', 'Redis'], status: 'Active', appliedDate: '10 Feb 2025', nirfRank: 60, accreditation: 'NAAC A' },
  { id: 'UNI5', name: 'LMN Technical University', tpoHead: 'Dean S. Saxena', email: 'dean@lmn.edu', state: 'Uttar Pradesh', studentsCount: 1120, skillGapLevel: 'Low', primaryGaps: ['PostgreSQL Optimization'], status: 'Delisted', delistReason: 'Delisted by Admin: Inactive placement cell & fraudulent placement records.', appliedDate: '20 Feb 2025', nirfRank: 84, accreditation: 'NAAC B+' },
  { id: 'UNI6', name: 'Heritage Institute of Science', tpoHead: 'Prof. Ananya Banerjee', email: 'tpo@heritage.ac.in', state: 'West Bengal', studentsCount: 890, skillGapLevel: 'Medium', primaryGaps: ['Kubernetes', 'CI/CD Pipelines'], status: 'Pending Approval', appliedDate: 'Yesterday 18:30', accreditation: 'UGC Recognized' },
  { id: 'UNI7', name: 'Apex National Academy', tpoHead: 'Dr. K. Srinivas', email: 'registrations@apex.edu', state: 'Telangana', studentsCount: 740, skillGapLevel: 'High', primaryGaps: ['Modern AI/LLMs', 'PyTorch'], status: 'Pending Approval', appliedDate: 'Today 09:15', accreditation: 'AICTE Approved' },
];