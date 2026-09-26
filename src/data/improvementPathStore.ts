import { CompanyImprovementPath, Internship, Skill, Project } from '../types';
import { checkJobEligibility } from './projectsStore';

const STORAGE_KEY = 'talentbridge_company_improvement_paths_v1';
export const IMPROVEMENT_PATHS_UPDATED_EVENT = 'tb:improvement_paths_updated';

export const initialCompanyPaths: CompanyImprovementPath[] = [];

export const loadCompanyImprovementPaths = (): CompanyImprovementPath[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveCompanyImprovementPaths([]);
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load company improvement paths', err);
    return [];
  }
};

export const saveCompanyImprovementPaths = (paths: CompanyImprovementPath[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(paths));
    window.dispatchEvent(new CustomEvent(IMPROVEMENT_PATHS_UPDATED_EVENT, { detail: paths }));
  } catch (err) {
    console.error('Failed to save company improvement paths', err);
  }
};

export const isCompanyInImprovementPath = (companyNameOrJobId: string, roleName?: string): boolean => {
  const paths = loadCompanyImprovementPaths();
  return paths.some(
    p => p.jobId === companyNameOrJobId || 
         p.id === `path-${companyNameOrJobId}` ||
         (roleName 
           ? p.companyName.toLowerCase() === companyNameOrJobId.toLowerCase() && p.targetRole.toLowerCase() === roleName.toLowerCase()
           : p.companyName.toLowerCase() === companyNameOrJobId.toLowerCase())
  );
};

export const getCompanyImprovementPathByJobId = (companyNameOrJobId: string, roleName?: string): CompanyImprovementPath | undefined => {
  const paths = loadCompanyImprovementPaths();
  return paths.find(
    p => p.jobId === companyNameOrJobId || 
         p.id === `path-${companyNameOrJobId}` ||
         (roleName
           ? p.companyName.toLowerCase() === companyNameOrJobId.toLowerCase() && p.targetRole.toLowerCase() === roleName.toLowerCase()
           : p.companyName.toLowerCase() === companyNameOrJobId.toLowerCase())
  );
};

export const addCompanyImprovementPath = (path: CompanyImprovementPath) => {
  const paths = loadCompanyImprovementPaths();
  // Match existing by exact ID, or matching jobId, or matching BOTH companyName and targetRole
  // This ensures 1 company can appear once per role, but different roles under the same company have distinct roadmaps!
  const existingIdx = paths.findIndex(p => 
    p.id === path.id || 
    (path.jobId && p.jobId === path.jobId) || 
    (p.companyName.toLowerCase() === path.companyName.toLowerCase() && 
     p.targetRole.toLowerCase() === path.targetRole.toLowerCase())
  );
  let updated: CompanyImprovementPath[];
  if (existingIdx >= 0) {
    updated = [...paths];
    updated[existingIdx] = path;
  } else {
    updated = [path, ...paths];
  }
  saveCompanyImprovementPaths(updated);
};

/**
 * Checks if a specific skill is already listed in the improvement path for a target opportunity
 */
export const isSkillInCompanyPath = (skillName: string, targetJob: Internship): boolean => {
  const paths = loadCompanyImprovementPaths();
  const path = paths.find(
    p => p.jobId === targetJob.id || 
         (p.companyName.toLowerCase() === targetJob.company.toLowerCase() && 
          p.targetRole.toLowerCase() === targetJob.title.toLowerCase())
  );
  if (!path) return false;
  return path.skillsMissing.some(s => s.name.toLowerCase() === skillName.toLowerCase());
};

/**
 * Adds a preferred or differentiator skill to the company's improvement roadmap
 * Creates the company path if it doesn't already exist.
 */
export const addSkillToCompanyImprovementPath = (
  skillName: string,
  targetJob: Internship,
  studentSkills: Skill[],
  projects: Project[]
): { path: CompanyImprovementPath; isNew: boolean; alreadyExisted: boolean } => {
  const paths = loadCompanyImprovementPaths();
  
  // Find matching path for this company & role
  const existing = paths.find(
    p => p.jobId === targetJob.id || 
         (p.companyName.toLowerCase() === targetJob.company.toLowerCase() && 
          p.targetRole.toLowerCase() === targetJob.title.toLowerCase())
  );

  let isNew = false;
  let alreadyExisted = false;
  let path: CompanyImprovementPath;

  if (!existing) {
    path = generateCompanyPathFromJob(targetJob, studentSkills, projects);
    isNew = true;
  } else {
    path = { ...existing };
  }

  // Check if skill is already in skillsMissing
  const alreadyInMissing = path.skillsMissing.some(
    s => s.name.toLowerCase() === skillName.toLowerCase()
  );

  if (alreadyInMissing) {
    alreadyExisted = true;
  } else {
    // Add to skillsMissing with company provenance
    const newMissingSkill = {
      name: skillName,
      importance: 'Preferred / Differentiator' as const,
      estimatedHours: 4,
      recommendedResource: `${skillName} Production Blueprint & Best Practices Guide (Targeted for ${targetJob.company})`,
      roadmapTopics: [
        `Fundamental concepts and production architectures of ${skillName}`,
        `Hands-on integration into ${targetJob.title} workflows at ${targetJob.company}`,
        `Performance tuning, edge cases, and technical interview defense questions`
      ],
      isCompleted: false
    };

    // Add targeted action item
    const actionId = `act-${path.id}-pref-${skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const actionExists = path.actionChecklist.some(a => a.id === actionId);

    const updatedChecklist = actionExists 
      ? path.actionChecklist 
      : [
          {
            id: actionId,
            title: `Master ${skillName} (${targetJob.company} Targeted Differentiator)`,
            description: `Targeted differentiator skill added from Skill Gap Analysis for ${targetJob.company} (${targetJob.title}).`,
            category: 'Skill' as const,
            completed: false
          },
          ...path.actionChecklist
        ];

    path = {
      ...path,
      skillsMissing: [newMissingSkill, ...path.skillsMissing],
      diagnosis: {
        ...path.diagnosis,
        missingSkillsCount: path.skillsMissing.length + 1,
        summary: path.diagnosis.summary + ` Includes targeted differentiator competency: ${skillName}.`
      },
      actionChecklist: updatedChecklist
    };
  }

  addCompanyImprovementPath(path);
  return { path, isNew, alreadyExisted };
};

export const deleteCompanyImprovementPath = (pathId: string) => {
  const paths = loadCompanyImprovementPaths();
  const updated = paths.filter(p => p.id !== pathId);
  saveCompanyImprovementPaths(updated);
};

export const toggleActionChecklist = (pathId: string, actionId: string) => {
  const paths = loadCompanyImprovementPaths();
  const updated = paths.map(path => {
    if (path.id !== pathId) return path;
    const newActions = path.actionChecklist.map(action => 
      action.id === actionId ? { ...action, completed: !action.completed } : action
    );
    return { ...path, actionChecklist: newActions };
  });
  saveCompanyImprovementPaths(updated);
};

export const toggleSkillMissingCompleted = (pathId: string, skillName: string) => {
  const paths = loadCompanyImprovementPaths();
  const updated = paths.map(path => {
    if (path.id !== pathId) return path;
    const newSkillsMissing = path.skillsMissing.map(s => 
      s.name === skillName ? { ...s, isCompleted: !s.isCompleted } : s
    );
    return { ...path, skillsMissing: newSkillsMissing };
  });
  saveCompanyImprovementPaths(updated);
};

/**
 * Dynamically analyzes a job against current student skills and projects
 * to generate a customized CompanyImprovementPath
 */
export const generateCompanyPathFromJob = (
  job: Internship, 
  studentSkills: Skill[], 
  projects: Project[]
): CompanyImprovementPath => {
  const eligibility = checkJobEligibility(job, studentSkills, projects);
  const knownSkillNames = studentSkills.map(s => s.name.toLowerCase());

  // Check which skills user has vs missing
  const skillsLearned: CompanyImprovementPath['skillsLearned'] = [];
  const skillsMissing: CompanyImprovementPath['skillsMissing'] = [];

  job.requiredSkills.forEach(reqSkill => {
    const isKnown = knownSkillNames.some(k => k.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(k));
    if (isKnown) {
      skillsLearned.push({
        name: reqSkill,
        proficiency: 'Intermediate',
        isVerified: true
      });
    } else {
      skillsMissing.push({
        name: reqSkill,
        importance: 'Mandatory',
        estimatedHours: 6,
        recommendedResource: `${reqSkill} Production Architecture & Best Practices Guide`,
        roadmapTopics: [
          `Core principles and fundamentals of ${reqSkill}`,
          `Integrating ${reqSkill} into scalable real-world architectures`,
          `Common anti-patterns, edge cases, and performance tuning`
        ],
        isCompleted: false
      });
    }
  });

  // Check if user has learned theoretical skills but lacks verified audited projects
  const hasLearnedSkillsLackingProject = 
    eligibility.requiredChecks.some(c => c.isSkillKnown && !c.isCoveredByProject) ||
    skillsMissing.length === 0;

  const pathId = `path-${job.id || job.company.toLowerCase().replace(/\s+/g, '-')}`;
  
  // Suggest a project tailored to the role
  const suggestedProjects = [
    {
      id: `proj-sugg-${job.id}-1`,
      title: `${job.title} Proof-of-Work Platform`,
      description: `A production-ready application tailored to demonstrate ${job.requiredSkills.slice(0, 3).join(', ')} with automated unit testing and clean architectural documentation.`,
      techStack: job.requiredSkills.slice(0, 4),
      difficulty: 'Advanced' as const,
      keyFeatures: [
        `Architected cleanly using ${job.requiredSkills.slice(0, 2).join(' and ')}`,
        'Asynchronous data synchronization and error boundary isolation',
        'Passing AST code audit with >85% originality threshold',
        'Documented README with architecture diagrams and API specs'
      ],
      defenseTopics: [
        `Walk through your state management and component boundary strategy for ${job.requiredSkills[0] || 'the frontend'}.`,
        `How does your implementation handle heavy concurrency and network failure?`
      ],
      status: 'not_started' as const
    }
  ];

  const actionChecklist = [
    ...skillsMissing.map((s, idx) => ({
      id: `act-${pathId}-s-${idx}`,
      title: `Master ${s.name} Roadmap Concepts`,
      description: `Study ${s.recommendedResource} and complete practical sandbox tasks.`,
      category: 'Skill' as const,
      completed: false
    })),
    {
      id: `act-${pathId}-proj`,
      title: `Construct Suggested Project: ${suggestedProjects[0].title}`,
      description: `Build out the repository implementing key features and push to GitHub.`,
      category: 'Project' as const,
      completed: false
    },
    {
      id: `act-${pathId}-def`,
      title: `Defend Project in AI Logic Q&A to Earn Integrity Seal`,
      description: `Verify repository in Projects view to fulfill mandatory company proof-of-work criteria.`,
      category: 'Defense' as const,
      completed: false
    },
    {
      id: `act-${pathId}-apply`,
      title: `Submit Application for ${job.title} at ${job.company}`,
      description: `All mandatory criteria met! Submit verified candidate dossier to recruiter.`,
      category: 'Apply' as const,
      completed: false
    }
  ];

  return {
    id: pathId,
    companyId: job.id,
    companyName: job.company,
    companyLogo: job.company.slice(0, 2).toUpperCase(),
    jobId: job.id,
    targetRole: job.title,
    stipendOrPackage: `${job.stipend} • ${job.type}`,
    campusType: job.campusType,
    createdAt: new Date().toISOString().split('T')[0],
    status: 'active',
    diagnosis: {
      summary: hasLearnedSkillsLackingProject
        ? `You have acquired the core skill requirements for ${job.company}, but lack an audited proof-of-work project demonstrating them under production rigor.`
        : `You are currently missing ${skillsMissing.length} required skill(s) for ${job.company}. Complete the targeted roadmap and construct an audited project to qualify.`,
      hasLearnedSkillsLackingProject,
      missingSkillsCount: skillsMissing.length,
      unverifiedProjectsCount: eligibility.requiredChecks.filter(c => !c.isCoveredByProject).length
    },
    skillsLearned,
    skillsMissing,
    projectRequirement: {
      needed: true,
      reason: hasLearnedSkillsLackingProject
        ? `Theoretical knowledge alone does not meet ${job.company}'s verified criteria. Building and auditing a project unlocks your application.`
        : `After completing the missing skill roadmap, build the suggested project to pass automated candidate screening.`,
      suggestedProjects
    },
    actionChecklist
  };
};
