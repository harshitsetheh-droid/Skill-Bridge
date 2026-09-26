import { Project, Skill, Internship } from '../types';

const STORAGE_KEY = 'skillbridge_student_projects_v3';
export const PROJECTS_UPDATED_EVENT = 'skillbridge_projects_updated';

export const defaultProjects: Project[] = [];

export const loadProjects = (): Project[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load projects from storage', e);
  }
  return [];
};

export const saveProjects = (projects: Project[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    window.dispatchEvent(new CustomEvent(PROJECTS_UPDATED_EVENT, { detail: projects }));
  } catch (e) {
    console.error('Failed to save projects to storage', e);
  }
};

export const addProject = (item: Omit<Project, 'id'>): Project => {
  const current = loadProjects();
  const created: Project = {
    ...item,
    id: `p-${Date.now()}`,
  };
  const updated = [created, ...current];
  saveProjects(updated);
  return created;
};

/**
 * Normalizes tech & skill strings to enable accurate comparison across projects & job listings.
 * e.g., 'React.js' -> 'react', 'JS' -> 'javascript', 'AI/ML' -> 'aiml', 'SQL & Relational DBs' -> 'sql'.
 */
export const normalizeTech = (name: string): string => {
  const s = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (s === 'js' || s === 'javascript' || s.includes('javascript') || s === 'ecmascript') return 'javascript';
  if (s === 'react' || s === 'reactjs' || s.includes('react')) return 'react';
  if (s === 'python' || s.includes('python')) return 'python';
  if (s === 'sql' || s.includes('sql') || s.includes('relational') || s.includes('postgres') || s.includes('mysql')) return 'sql';
  if (s === 'docker' || s.includes('docker') || s.includes('container')) return 'docker';
  if (s === 'aiml' || s === 'ai' || s === 'ml' || s.includes('aiml') || s.includes('machinelearning') || s.includes('artificialintel')) return 'aiml';
  if (s === 'html' || s === 'html5' || s.includes('html')) return 'html';
  if (s === 'css' || s === 'css3' || s.includes('css') || s.includes('tailwind')) return 'css';
  if (s === 'ts' || s === 'typescript' || s.includes('typescript')) return 'typescript';
  if (s === 'git' || s.includes('git')) return 'git';
  if (s === 'node' || s === 'nodejs' || s.includes('node') || s.includes('express')) return 'node';
  if (s === 'kubernetes' || s === 'k8s' || s.includes('kubernetes')) return 'kubernetes';
  if (s === 'aws' || s.includes('aws') || s.includes('cloud')) return 'aws';
  return s;
};

export interface SkillRequirementCheck {
  skillName: string;
  normalized: string;
  isCoveredByProject: boolean;
  coveringProjects: { id: string; title: string; tech: string }[];
  isSkillKnown: boolean;
  proficiency: number;
  isRequired: boolean; // True = strictly mandatory project, False = preferred (project optional)
}

export interface CompanyAtsBreakdown {
  skillName: string;
  normalized: string;
  isKnown: boolean;
  isVerified: boolean;
  isCoveredByProject: boolean;
  proficiency: number;
  coveringProjectCount: number;
}

export interface CompanyAtsResult {
  atsScore: number;
  requiredCount: number;
  hasCount: number;
  verifiedCount: number;
  projectCount: number;
  breakdown: CompanyAtsBreakdown[];
}

/**
 * Computes a per-company ATS score based purely on THAT company's required skills.
 * Formula (weighted over the company's required skill set):
 *   ATS = 40% possession + 35% verified + 25% project coverage
 * Score therefore differs per company because each company demands different skills.
 */
export const computeCompanyAtsScore = (
  requiredSkills: string[],
  studentSkills: Skill[],
  projects: Project[]
): CompanyAtsResult => {
  const breakdown: CompanyAtsBreakdown[] = (requiredSkills || []).map((reqSkill) => {
    const normReq = normalizeTech(reqSkill);

    const matchingSkill = studentSkills.find((s) => {
      const normS = normalizeTech(s.name);
      return normS === normReq || s.name.toLowerCase().includes(normReq) || reqSkill.toLowerCase().includes(normS);
    });

    let coveringProjectCount = 0;
    projects.forEach((proj) => {
      const matchedTech = proj.techStack.find((tech) => {
        const normTech = normalizeTech(tech);
        return normTech === normReq || tech.toLowerCase().includes(normReq) || reqSkill.toLowerCase().includes(normTech);
      });
      if (matchedTech) coveringProjectCount += 1;
    });

    return {
      skillName: reqSkill,
      normalized: normReq,
      isKnown: !!matchingSkill,
      isVerified: !!matchingSkill && matchingSkill.status === 'verified',
      isCoveredByProject: coveringProjectCount > 0,
      proficiency: matchingSkill ? matchingSkill.proficiency : 0,
      coveringProjectCount,
    };
  });

  const requiredCount = breakdown.length;
  const hasCount = breakdown.filter((b) => b.isKnown).length;
  const verifiedCount = breakdown.filter((b) => b.isVerified).length;
  const projectCount = breakdown.filter((b) => b.isCoveredByProject).length;

  const atsScore =
    requiredCount === 0
      ? 0
      : Math.round(
          (0.4 * (hasCount / requiredCount) + 0.35 * (verifiedCount / requiredCount) + 0.25 * (projectCount / requiredCount)) * 100
        );

  return { atsScore, requiredCount, hasCount, verifiedCount, projectCount, breakdown };
};

export interface ApplicationEligibilityResult {
  isApproved: boolean;
  allRequiredSkillsMet: boolean;
  allRequiredSkillsHaveProjects: boolean;
  requiredChecks: SkillRequirementCheck[];
  preferredChecks: SkillRequirementCheck[];
  missingRequiredSkills: string[];
  missingRequiredProjects: string[];
  summaryMessage: string;
}

/**
 * Validates student eligibility for an internship / job application.
 * RULE:
 * 1. Student must possess all REQUIRED skills with acceptable proficiency (>= 40% or marked verified/known).
 * 2. Every single REQUIRED skill MUST be covered in at least one student project (across all portfolio projects).
 * 3. PREFERRED skills do NOT require projects (project optional).
 */
export const checkJobEligibility = (
  job: Internship,
  studentSkills: Skill[],
  projects: Project[]
): ApplicationEligibilityResult => {
  // 1. Evaluate Required Skills
  const requiredChecks: SkillRequirementCheck[] = job.requiredSkills.map((reqSkill) => {
    const normReq = normalizeTech(reqSkill);

    // Check proficiency in student's skills
    const matchingSkill = studentSkills.find((s) => {
      const normS = normalizeTech(s.name);
      return normS === normReq || s.name.toLowerCase().includes(normReq) || reqSkill.toLowerCase().includes(normS);
    });

    const isSkillKnown = !!matchingSkill;
    const proficiency = matchingSkill ? matchingSkill.proficiency : 0;

    // Check project coverage across all projects
    const coveringProjects: { id: string; title: string; tech: string }[] = [];
    projects.forEach((proj) => {
      const matchedTech = proj.techStack.find((tech) => {
        const normTech = normalizeTech(tech);
        return normTech === normReq || tech.toLowerCase().includes(normReq) || reqSkill.toLowerCase().includes(normTech);
      });
      if (matchedTech) {
        coveringProjects.push({ id: proj.id, title: proj.title, tech: matchedTech });
      }
    });

    return {
      skillName: reqSkill,
      normalized: normReq,
      isCoveredByProject: coveringProjects.length > 0,
      coveringProjects,
      isSkillKnown,
      proficiency,
      isRequired: true,
    };
  });

  // 2. Evaluate Preferred Skills (Project NOT mandatory)
  const preferredChecks: SkillRequirementCheck[] = (job.preferredSkills || []).map((prefSkill) => {
    const normPref = normalizeTech(prefSkill);

    const matchingSkill = studentSkills.find((s) => {
      const normS = normalizeTech(s.name);
      return normS === normPref || s.name.toLowerCase().includes(normPref) || prefSkill.toLowerCase().includes(normS);
    });

    const isSkillKnown = !!matchingSkill;
    const proficiency = matchingSkill ? matchingSkill.proficiency : 0;

    const coveringProjects: { id: string; title: string; tech: string }[] = [];
    projects.forEach((proj) => {
      const matchedTech = proj.techStack.find((tech) => {
        const normTech = normalizeTech(tech);
        return normTech === normPref || tech.toLowerCase().includes(normPref) || prefSkill.toLowerCase().includes(normTech);
      });
      if (matchedTech) {
        coveringProjects.push({ id: proj.id, title: proj.title, tech: matchedTech });
      }
    });

    return {
      skillName: prefSkill,
      normalized: normPref,
      isCoveredByProject: coveringProjects.length > 0,
      coveringProjects,
      isSkillKnown,
      proficiency,
      isRequired: false, // PREFERRED: Project is NOT mandatory!
    };
  });

  const missingRequiredSkills = requiredChecks
    .filter((c) => !c.isSkillKnown || c.proficiency < 35)
    .map((c) => c.skillName);

  const missingRequiredProjects = requiredChecks
    .filter((c) => !c.isCoveredByProject)
    .map((c) => c.skillName);

  const allRequiredSkillsMet = missingRequiredSkills.length === 0;
  const allRequiredSkillsHaveProjects = missingRequiredProjects.length === 0;

  const isApproved = allRequiredSkillsMet && allRequiredSkillsHaveProjects;

  let summaryMessage = '';
  if (isApproved) {
    summaryMessage = 'Application Approved: You possess all required competencies and have verified project demonstrations covering 100% of the company\'s mandatory skill requirements.';
  } else if (!allRequiredSkillsHaveProjects && !allRequiredSkillsMet) {
    summaryMessage = `Application Blocked: Missing verified competency in (${missingRequiredSkills.join(', ')}) AND missing mandatory project demonstrations for (${missingRequiredProjects.join(', ')}).`;
  } else if (!allRequiredSkillsHaveProjects) {
    summaryMessage = `Application Blocked: Company strictly mandates project demonstrations for all Required Skills. Missing project proof for: ${missingRequiredProjects.join(', ')}. (Preferred skills do not require projects).`;
  } else {
    summaryMessage = `Application Blocked: You need to raise your proficiency in required skills: ${missingRequiredSkills.join(', ')}.`;
  }

  return {
    isApproved,
    allRequiredSkillsMet,
    allRequiredSkillsHaveProjects,
    requiredChecks,
    preferredChecks,
    missingRequiredSkills,
    missingRequiredProjects,
    summaryMessage,
  };
};
