import { loadBatchFeedbackList, CompanyBatchFeedback, BATCH_FEEDBACK_UPDATED_EVENT } from './feedbackStore';

export const FEEDBACK_SKILLS_STORAGE_KEY = 'skillbridge_selected_feedback_skills_v1';
export const FEEDBACK_SKILLS_UPDATED_EVENT = 'skillbridge_feedback_skills_updated';

// Known coverage map for feedback skills across departments
export const defaultFeedbackSkillCoverage: Record<string, Record<string, number>> = {};

export interface FeedbackSkillMetadata {
  skill: string;
  sourceCompanies: string[];
  sourceDrives: string[];
  priority: 'Critical' | 'High' | 'Medium';
  isMissingInBatch: boolean;
  isRequiredNotFound: boolean;
  departmentCoverage: Record<string, number>;
}

// Extract all unique skills present in the batch feedback records
export const getAllFeedbackSkills = (): FeedbackSkillMetadata[] => {
  const feedbacks = loadBatchFeedbackList();
  const skillMap: Record<string, {
    companies: Set<string>;
    drives: Set<string>;
    isMissing: boolean;
    isRequiredNotFound: boolean;
    priority: 'Critical' | 'High' | 'Medium';
  }> = {};

  feedbacks.forEach((fb) => {
    fb.missingSkills.forEach((skill) => {
      const s = skill.trim();
      if (!skillMap[s]) {
        skillMap[s] = {
          companies: new Set(),
          drives: new Set(),
          isMissing: true,
          isRequiredNotFound: false,
          priority: fb.priority
        };
      }
      skillMap[s].companies.add(fb.companyName);
      skillMap[s].drives.add(fb.hiringDriveTitle);
      skillMap[s].isMissing = true;
      if (fb.priority === 'Critical') skillMap[s].priority = 'Critical';
    });

    fb.requiredSkillsNotFound.forEach((skill) => {
      const s = skill.trim();
      if (!skillMap[s]) {
        skillMap[s] = {
          companies: new Set(),
          drives: new Set(),
          isMissing: false,
          isRequiredNotFound: true,
          priority: fb.priority
        };
      }
      skillMap[s].companies.add(fb.companyName);
      skillMap[s].drives.add(fb.hiringDriveTitle);
      skillMap[s].isRequiredNotFound = true;
      if (fb.priority === 'Critical') skillMap[s].priority = 'Critical';
    });
  });

  return Object.keys(skillMap).map((skill) => {
    const meta = skillMap[skill];
    const coverage = defaultFeedbackSkillCoverage[skill] || {
      'CSE': 30,
      'AI & Data Science': 35,
      'ECE': 20,
      'Mechanical': 10
    };

    return {
      skill,
      sourceCompanies: Array.from(meta.companies),
      sourceDrives: Array.from(meta.drives),
      priority: meta.priority,
      isMissingInBatch: meta.isMissing,
      isRequiredNotFound: meta.isRequiredNotFound,
      departmentCoverage: coverage
    };
  });
};

export const defaultSelectedSkills: string[] = [];

export const loadSelectedFeedbackSkills = (): string[] => {
  try {
    const saved = localStorage.getItem(FEEDBACK_SKILLS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load selected feedback skills', e);
  }
  return [];
};

export const saveSelectedFeedbackSkills = (skills: string[]) => {
  try {
    localStorage.setItem(FEEDBACK_SKILLS_STORAGE_KEY, JSON.stringify(skills));
    window.dispatchEvent(new CustomEvent(FEEDBACK_SKILLS_UPDATED_EVENT, { detail: skills }));
  } catch (e) {
    console.error('Failed to save selected feedback skills', e);
  }
};

export const toggleFeedbackSkillSelection = (skill: string) => {
  const current = loadSelectedFeedbackSkills();
  const exists = current.includes(skill);
  const updated = exists ? current.filter((s) => s !== skill) : [...current, skill];
  saveSelectedFeedbackSkills(updated);
  return updated;
};

export const selectAllFeedbackSkills = () => {
  const all = getAllFeedbackSkills().map((s) => s.skill);
  saveSelectedFeedbackSkills(all);
  return all;
};

export const selectCriticalFeedbackSkills = () => {
  const critical = getAllFeedbackSkills()
    .filter((s) => s.priority === 'Critical' || s.isMissingInBatch)
    .map((s) => s.skill);
  saveSelectedFeedbackSkills(critical);
  return critical;
};

export type FeedbackSkillItem = FeedbackSkillMetadata;

export interface FeedbackHeatmapRow {
  skill: string;
  priority: string;
  sourceCompanies: string[];
  departments: Record<string, number>;
}

export const getFeedbackHeatmapRows = (selectedSkills: string[]): FeedbackHeatmapRow[] => {
  const allSkills = getAllFeedbackSkills();
  const selectedSet = new Set(selectedSkills);

  return allSkills
    .filter((item) => selectedSet.has(item.skill))
    .map((item) => ({
      skill: item.skill,
      priority: item.priority,
      sourceCompanies: item.sourceCompanies,
      departments: item.departmentCoverage
    }));
};
