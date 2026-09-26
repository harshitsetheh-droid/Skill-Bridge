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
  name: '',
  email: '',
  username: '',
  branch: '',
  college: '',
  year: '',
  cgpa: '',
  readinessScore: 0,
  stats: {
    skillsVerified: 0,
    activeApplications: 0,
    projectsReviewed: 0,
  },
  bio: '',
  links: {
    github: '',
    portfolio: '',
    linkedin: '',
  },
};

export const initialSkills: Skill[] = [];

export const initialProjects: Project[] = [];

export const initialInternships: Internship[] = [];

export const courseRecommendations: CourseRecommendation[] = [];

export const initialCompanyData = {
  name: '',
  tagline: '',
  logo: '',
  about: '',
  recruitmentPhilosophy: '',
  highlights: [],
  stats: {
    totalApplicants: 0,
    avgMatchScore: 0,
    verifiedCandidatesPercent: 0,
    activePostings: 0,
  }
};

export const initialCandidates: Candidate[] = [];

export const topMissingSkillsData = [];

export const initialInstitutionData = {
  name: '',
  accreditation: '',
  stats: {
    totalStudents: 0,
    placementReadyPercent: 0,
    activeJobPostings: 0,
    avgMatchScore: 0,
  },
  departments: [],
};

export const departmentGapsData: DepartmentGapData[] = [];

export const studentReadinessRows: StudentReadinessRow[] = [];

export const flaggedProjectsRows: FlaggedProjectRow[] = [];

export const partnerCompanies: PartnerCompany[] = [];

export const demandVsSupplySkills = [];

export const departmentsList = ['CSE', 'ECE', 'Mechanical', 'AI & Data Science'];

export const curriculumHeatmap = [];

export const initialInstitutionStudents: InstitutionStudent[] = [];

export const partnerCompaniesList = [];