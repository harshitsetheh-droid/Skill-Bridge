import { Skill, SkillLevels, SkillCheckpoint } from '../types';

const SKILLS_STORAGE_KEY = 'skillbridge_student_skills_v4';
const CURRICULUM_SKILLS_STORAGE_KEY = 'skillbridge_curriculum_catalog_v2';
export const SKILLS_UPDATED_EVENT = 'skillbridge_skills_updated';
export const CURRICULUM_UPDATED_EVENT = 'skillbridge_curriculum_updated';

// Internal Weight Configuration: Beginner (33%) + Intermediate (33%) + Advance (34%) = 100%
export const TIER_WEIGHTS = {
  beginner: 33,
  intermediate: 33,
  advance: 34,
} as const;

export interface CalculationResult {
  proficiency: number;
  beginnerScore: number;
  intermediateScore: number;
  advanceScore: number;
  checkpointValues: {
    beginner: number;
    intermediate: number;
    advance: number;
  };
}

/**
 * Automatically calculates checkpoint values and overall skill proficiency.
 * Beginner checkpoints share 33% total weight (33 / Nb each).
 * Intermediate checkpoints share 33% total weight (33 / Ni each).
 * Advance checkpoints share 34% total weight (34 / Na each).
 */
export const calculateSkillProficiency = (levels?: SkillLevels): CalculationResult => {
  if (!levels) {
    return {
      proficiency: 0,
      beginnerScore: 0,
      intermediateScore: 0,
      advanceScore: 0,
      checkpointValues: { beginner: 0, intermediate: 0, advance: 0 },
    };
  }

  const bCheckpoints = levels.beginner?.checkpoints || [];
  const iCheckpoints = levels.intermediate?.checkpoints || [];
  const aCheckpoints = levels.advance?.checkpoints || [];

  const nb = bCheckpoints.length;
  const ni = iCheckpoints.length;
  const na = aCheckpoints.length;

  const valB = nb > 0 ? TIER_WEIGHTS.beginner / nb : 0;
  const valI = ni > 0 ? TIER_WEIGHTS.intermediate / ni : 0;
  const valA = na > 0 ? TIER_WEIGHTS.advance / na : 0;

  const compB = bCheckpoints.filter((c) => c.completed).length;
  const compI = iCheckpoints.filter((c) => c.completed).length;
  const compA = aCheckpoints.filter((c) => c.completed).length;

  const scoreB = compB * valB;
  const scoreI = compI * valI;
  const scoreA = compA * valA;

  const total = Math.min(100, Math.round(scoreB + scoreI + scoreA));

  return {
    proficiency: total,
    beginnerScore: Number(scoreB.toFixed(1)),
    intermediateScore: Number(scoreI.toFixed(1)),
    advanceScore: Number(scoreA.toFixed(1)),
    checkpointValues: {
      beginner: Number(valB.toFixed(1)),
      intermediate: Number(valI.toFixed(1)),
      advance: Number(valA.toFixed(1)),
    },
  };
};

export const createDefaultLevelsForSkill = (
  skillName: string,
  category: Skill['category']
): SkillLevels => {
  const norm = skillName.toLowerCase();

  if (norm.includes('react')) {
    return {
      beginner: {
        weight: 33,
        checkpoints: [
          { id: 'b1', title: 'JSX Syntax & Virtual DOM Mechanics', completed: true },
          { id: 'b2', title: 'Components, Props & Local State', completed: true },
          { id: 'b3', title: 'Synthetic Events & Form Handling', completed: true },
        ],
      },
      intermediate: {
        weight: 33,
        checkpoints: [
          { id: 'i1', title: 'useEffect Lifecycle & Dependency Arrays', completed: true },
          { id: 'i2', title: 'Context API & Custom Reusable Hooks', completed: true },
          { id: 'i3', title: 'React.memo, useMemo & useCallback Performance', completed: true },
        ],
      },
      advance: {
        weight: 34,
        checkpoints: [
          { id: 'a1', title: 'React Server Components & Suspense Streams', completed: true },
          { id: 'a2', title: 'Custom Reconcilers & Concurrent Scheduling', completed: false },
        ],
      },
    };
  }

  if (norm.includes('python')) {
    return {
      beginner: {
        weight: 33,
        checkpoints: [
          { id: 'b1', title: 'Variables, Conditionals & Built-in Collections', completed: true },
          { id: 'b2', title: 'Functions, Scoping & Standard Modules', completed: true },
          { id: 'b3', title: 'File Handling & Exception Blocks', completed: true },
        ],
      },
      intermediate: {
        weight: 33,
        checkpoints: [
          { id: 'i1', title: 'OOP Classes, Dunder Methods & Inheritance', completed: true },
          { id: 'i2', title: 'Decorators, Generators & Context Managers', completed: true },
        ],
      },
      advance: {
        weight: 34,
        checkpoints: [
          { id: 'a1', title: 'Asyncio Event Loop, Coroutines & Tasks', completed: true },
          { id: 'a2', title: 'Memory Profiling, C-Extensions & GIL Tuning', completed: false },
        ],
      },
    };
  }

  if (norm.includes('sql') || norm.includes('database')) {
    return {
      beginner: {
        weight: 33,
        checkpoints: [
          { id: 'b1', title: 'SELECT, WHERE, ORDER BY & Basic Filtering', completed: true },
          { id: 'b2', title: 'INNER, LEFT, RIGHT & FULL OUTER JOINs', completed: true },
          { id: 'b3', title: 'GROUP BY, HAVING & Aggregation Functions', completed: true },
        ],
      },
      intermediate: {
        weight: 33,
        checkpoints: [
          { id: 'i1', title: 'ACID Transactions, Isolation Levels & Locks', completed: true },
          { id: 'i2', title: 'Subqueries, CTEs & Window Functions', completed: true },
        ],
      },
      advance: {
        weight: 34,
        checkpoints: [
          { id: 'a1', title: 'EXPLAIN Query Plans & B-Tree / GIN Index Optimization', completed: false },
          { id: 'a2', title: 'Database Partitioning, Sharding & Replication Lag', completed: false },
        ],
      },
    };
  }

  if (norm.includes('docker') || norm.includes('container')) {
    return {
      beginner: {
        weight: 33,
        checkpoints: [
          { id: 'b1', title: 'Container vs VM Concepts & Docker CLI commands', completed: true },
          { id: 'b2', title: 'Writing basic Dockerfiles (FROM, RUN, CMD)', completed: false },
        ],
      },
      intermediate: {
        weight: 33,
        checkpoints: [
          { id: 'i1', title: 'Multi-stage Builds & Image Size Optimization', completed: false },
          { id: 'i2', title: 'Docker Compose, Networks & Persistent Volumes', completed: false },
        ],
      },
      advance: {
        weight: 34,
        checkpoints: [
          { id: 'a1', title: 'Container Security Hardening & Non-root Users', completed: false },
          { id: 'a2', title: 'Kubernetes Pod Manifests & Ingress Controllers', completed: false },
        ],
      },
    };
  }

  if (norm.includes('aiml') || norm.includes('ai') || norm.includes('machine learning')) {
    return {
      beginner: {
        weight: 33,
        checkpoints: [
          { id: 'b1', title: 'Supervised vs Unsupervised Learning & Preprocessing', completed: true },
          { id: 'b2', title: 'Linear Regression, Decision Trees & Model Metrics', completed: true },
        ],
      },
      intermediate: {
        weight: 33,
        checkpoints: [
          { id: 'i1', title: 'Neural Networks, Backpropagation & Activation Functions', completed: true },
          { id: 'i2', title: 'Scikit-Learn Pipelines, Overfitting & Cross-Validation', completed: true },
        ],
      },
      advance: {
        weight: 34,
        checkpoints: [
          { id: 'a1', title: 'Transformer Architectures & Attention Mechanisms', completed: true },
          { id: 'a2', title: 'Model Quantization, ONNX & Edge Inference Serving', completed: false },
        ],
      },
    };
  }

  if (norm.includes('html')) {
    return {
      beginner: {
        weight: 33,
        checkpoints: [
          { id: 'b1', title: 'Semantic HTML5 Elements & Document Head Metadata', completed: true },
          { id: 'b2', title: 'Forms, Input Types, Labels & Accessibility ARIA', completed: true },
        ],
      },
      intermediate: {
        weight: 33,
        checkpoints: [
          { id: 'i1', title: 'DOM Tree Structure & Modern Event Propagation', completed: true },
          { id: 'i2', title: 'Audio/Video APIs & Canvas Rendering Context', completed: true },
        ],
      },
      advance: {
        weight: 34,
        checkpoints: [
          { id: 'a1', title: 'Web Components (Custom Elements & Shadow DOM)', completed: true },
          { id: 'a2', title: 'SEO Best Practices & Core Web Vitals Optimization', completed: false },
        ],
      },
    };
  }

  if (norm.includes('css')) {
    return {
      beginner: {
        weight: 33,
        checkpoints: [
          { id: 'b1', title: 'Box Model, Margins, Padding & Specificity Rules', completed: true },
          { id: 'b2', title: 'Flexbox Containers & Alignment Axis Controls', completed: true },
        ],
      },
      intermediate: {
        weight: 33,
        checkpoints: [
          { id: 'i1', title: 'CSS Grid Layouts & Responsive Media Queries', completed: true },
          { id: 'i2', title: 'CSS Custom Properties (Variables) & Dark Modes', completed: true },
        ],
      },
      advance: {
        weight: 34,
        checkpoints: [
          { id: 'a1', title: 'Hardware-Accelerated Keyframe Transitions', completed: true },
          { id: 'a2', title: 'BEM Architecture & CSS Houdini Paint Worklets', completed: false },
        ],
      },
    };
  }

  if (norm.includes('javascript') || norm.includes('js')) {
    return {
      beginner: {
        weight: 33,
        checkpoints: [
          { id: 'b1', title: 'ES6+ Syntax, Const/Let, Arrow Functions & Destructuring', completed: true },
          { id: 'b2', title: 'Array Methods (map, filter, reduce) & Object Shorthands', completed: true },
        ],
      },
      intermediate: {
        weight: 33,
        checkpoints: [
          { id: 'i1', title: 'Promises, Async/Await & Fetch API Exception Handling', completed: true },
          { id: 'i2', title: 'Closures, Lexical Scope & Execution Context', completed: true },
        ],
      },
      advance: {
        weight: 34,
        checkpoints: [
          { id: 'a1', title: 'Event Loop, Microtasks & Web Worker Concurrency', completed: true },
          { id: 'a2', title: 'V8 Engine Optimization, Memory Leaks & Garbage Collection', completed: false },
        ],
      },
    };
  }

  if (norm.includes('typescript')) {
    return {
      beginner: {
        weight: 33,
        checkpoints: [
          { id: 'b1', title: 'Primitive Types, Interfaces & Type Aliases', completed: true },
          { id: 'b2', title: 'Function Signatures & Optional/Readonly Props', completed: true },
        ],
      },
      intermediate: {
        weight: 33,
        checkpoints: [
          { id: 'i1', title: 'Generics, Constraints & Utility Types', completed: true },
          { id: 'i2', title: 'Union Narrowing, Type Guards & Discriminated Unions', completed: true },
        ],
      },
      advance: {
        weight: 34,
        checkpoints: [
          { id: 'a1', title: 'Conditional Types, Inferred Keywords & Template Literals', completed: false },
          { id: 'a2', title: 'Advanced AST Typing & Compiler Configuration', completed: false },
        ],
      },
    };
  }

  // Generic fallback 3 levels
  return {
    beginner: {
      weight: 33,
      checkpoints: [
        { id: 'b1', title: `Core fundamentals & setup of ${skillName}`, completed: true },
        { id: 'b2', title: `Basic syntax and standard usage patterns`, completed: false },
      ],
    },
    intermediate: {
      weight: 33,
      checkpoints: [
        { id: 'i1', title: `Real-world component / service implementation`, completed: false },
        { id: 'i2', title: `Error handling, validation & best practices`, completed: false },
      ],
    },
    advance: {
      weight: 34,
      checkpoints: [
        { id: 'a1', title: `Production performance tuning & security audit`, completed: false },
        { id: 'a2', title: `Architectural design and distributed scalability`, completed: false },
      ],
    },
  };
};



export const loadCurriculumCatalog = (): Skill[] => {
  try {
    const saved = localStorage.getItem(CURRICULUM_SKILLS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load curriculum catalog', e);
  }
  return [];
};

export const saveCurriculumCatalog = (catalog: Skill[]) => {
  try {
    localStorage.setItem(CURRICULUM_SKILLS_STORAGE_KEY, JSON.stringify(catalog));
    window.dispatchEvent(new CustomEvent(CURRICULUM_UPDATED_EVENT, { detail: catalog }));
  } catch (e) {
    console.error('Failed to save curriculum catalog', e);
  }
};

export const loadStudentSkills = (): Skill[] => {
  try {
    const saved = localStorage.getItem(SKILLS_STORAGE_KEY);
    if (saved) {
      const parsed: Skill[] = JSON.parse(saved);
      // Ensure all loaded skills have levels and up-to-date calculation
      return parsed.map((skill) => {
        if (!skill.levels) {
          skill.levels = createDefaultLevelsForSkill(skill.name, skill.category);
        }
        const calc = calculateSkillProficiency(skill.levels);
        skill.proficiency = calc.proficiency;
        skill.level = calc.proficiency >= 67 ? 'Advanced' : calc.proficiency >= 34 ? 'Intermediate' : 'Beginner';
        return skill;
      });
    }
  } catch (e) {
    console.error('Failed to load student skills', e);
  }
  return [];
};

export const saveStudentSkills = (skills: Skill[]) => {
  try {
    localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(skills));
    window.dispatchEvent(new CustomEvent(SKILLS_UPDATED_EVENT, { detail: skills }));
  } catch (e) {
    console.error('Failed to save student skills', e);
  }
};

export const toggleSkillCheckpoint = (
  skillId: string,
  tier: 'beginner' | 'intermediate' | 'advance',
  checkpointId: string
): { updatedSkills: Skill[]; changedSkill: Skill | null } => {
  const currentSkills = loadStudentSkills();
  let changedSkill: Skill | null = null;

  const updatedSkills = currentSkills.map((skill) => {
    if (skill.id === skillId && skill.levels) {
      const checkpoints = skill.levels[tier].checkpoints.map((cp) =>
        cp.id === checkpointId ? { ...cp, completed: !cp.completed } : cp
      );

      const newLevels: SkillLevels = {
        ...skill.levels,
        [tier]: {
          ...skill.levels[tier],
          checkpoints,
        },
      };

      const calc = calculateSkillProficiency(newLevels);
      const newProficiency = calc.proficiency;
      const newLevel: Skill['level'] =
        newProficiency >= 67 ? 'Advanced' : newProficiency >= 34 ? 'Intermediate' : 'Beginner';

      const updated: Skill = {
        ...skill,
        levels: newLevels,
        proficiency: newProficiency,
        level: newLevel,
      };

      changedSkill = updated;
      return updated;
    }
    return skill;
  });

  saveStudentSkills(updatedSkills);
  return { updatedSkills, changedSkill };
};

export const setSkillCheckpointCompleted = (
  skillId: string,
  tier: 'beginner' | 'intermediate' | 'advance',
  checkpointId: string,
  completed: boolean = true
): { updatedSkills: Skill[]; changedSkill: Skill | null } => {
  const currentSkills = loadStudentSkills();
  let changedSkill: Skill | null = null;

  const updatedSkills = currentSkills.map((skill) => {
    if (skill.id === skillId && skill.levels) {
      const checkpoints = skill.levels[tier].checkpoints.map((cp) =>
        cp.id === checkpointId ? { ...cp, completed } : cp
      );

      const newLevels: SkillLevels = {
        ...skill.levels,
        [tier]: {
          ...skill.levels[tier],
          checkpoints,
        },
      };

      const calc = calculateSkillProficiency(newLevels);
      const newProficiency = calc.proficiency;
      const newLevel: Skill['level'] =
        newProficiency >= 67 ? 'Advanced' : newProficiency >= 34 ? 'Intermediate' : 'Beginner';

      const updated: Skill = {
        ...skill,
        levels: newLevels,
        proficiency: newProficiency,
        level: newLevel,
      };

      changedSkill = updated;
      return updated;
    }
    return skill;
  });

  saveStudentSkills(updatedSkills);
  return { updatedSkills, changedSkill };
};

export const addStudentSkill = (
  skillName: string,
  category: Skill['category'] = 'Frontend',
  initialProficiency?: number
): { success: boolean; skill?: Skill; message: string } => {
  const currentSkills = loadStudentSkills();
  const normalized = skillName.trim().toLowerCase();

  const existing = currentSkills.find((s) => s.name.toLowerCase() === normalized);
  if (existing) {
    return { success: false, message: `"${skillName}" is already in your skills profile.` };
  }

  // Check if it exists in curriculum catalog to inherit rich checkpoints
  const catalog = loadCurriculumCatalog();
  const fromCatalog = catalog.find((s) => s.name.toLowerCase() === normalized);

  let levels: SkillLevels;
  if (fromCatalog && fromCatalog.levels) {
    // Clone checkpoints with uncompleted status for the student
    levels = JSON.parse(JSON.stringify(fromCatalog.levels));
    levels.beginner.checkpoints.forEach((c) => (c.completed = false));
    levels.intermediate.checkpoints.forEach((c) => (c.completed = false));
    levels.advance.checkpoints.forEach((c) => (c.completed = false));
  } else {
    levels = createDefaultLevelsForSkill(skillName, category);
  }

  const calc = calculateSkillProficiency(levels);
  const newSkill: Skill = {
    id: `skill-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: skillName.trim(),
    category,
    proficiency: calc.proficiency,
    level: calc.proficiency >= 67 ? 'Advanced' : calc.proficiency >= 34 ? 'Intermediate' : 'Beginner',
    status: 'self-claimed',
    verifiedDate: 'Added from Curriculum',
    quizAvailable: true,
    levels,
  };

  const updated = [newSkill, ...currentSkills];
  saveStudentSkills(updated);
  return { success: true, skill: newSkill, message: `Added "${skillName}" to My Skills!` };
};

export const hasStudentSkill = (skillName: string): boolean => {
  const currentSkills = loadStudentSkills();
  const normalized = skillName.trim().toLowerCase();
  return currentSkills.some((s) => s.name.toLowerCase() === normalized);
};

export const registerCurriculumSkill = (
  name: string,
  category: Skill['category'],
  beginnerCheckpoints: string[],
  intermediateCheckpoints: string[],
  advanceCheckpoints: string[]
): Skill => {
  const catalog = loadCurriculumCatalog();

  const levels: SkillLevels = {
    beginner: {
      weight: 33,
      checkpoints: beginnerCheckpoints.map((title, i) => ({
        id: `b-${i + 1}`,
        title: title.trim(),
        completed: false,
      })),
    },
    intermediate: {
      weight: 33,
      checkpoints: intermediateCheckpoints.map((title, i) => ({
        id: `i-${i + 1}`,
        title: title.trim(),
        completed: false,
      })),
    },
    advance: {
      weight: 34,
      checkpoints: advanceCheckpoints.map((title, i) => ({
        id: `a-${i + 1}`,
        title: title.trim(),
        completed: false,
      })),
    },
  };

  const newSkill: Skill = {
    id: `curr-${Date.now()}`,
    name: name.trim(),
    category,
    proficiency: 0,
    level: 'Beginner',
    status: 'verified',
    levels,
  };

  const updatedCatalog = [newSkill, ...catalog.filter((s) => s.name.toLowerCase() !== name.trim().toLowerCase())];
  saveCurriculumCatalog(updatedCatalog);
  return newSkill;
};

export const updateSkillVerification = (
  skillId: string,
  status: 'verified' | 'self-claimed',
  assessmentScore: number
): { success: boolean; updatedSkill?: Skill } => {
  const currentSkills = loadStudentSkills();
  let updatedSkill: Skill | undefined;

  const updatedList = currentSkills.map((skill) => {
    if (skill.id === skillId) {
      updatedSkill = {
        ...skill,
        status,
        assessmentScore,
        assessmentAttemptDate: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        verifiedDate: status === 'verified' ? `AI Verified (${assessmentScore}%)` : undefined,
        beginnerVerified: status === 'verified',
      };
      return updatedSkill;
    }
    return skill;
  });

  if (updatedSkill) {
    saveStudentSkills(updatedList);
    return { success: true, updatedSkill };
  }
  return { success: false };
};

