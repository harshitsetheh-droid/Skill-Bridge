import { Skill } from '../types';

export interface StoredResume {
  id: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  atsScore: number;
  formattingScore: number;
  keywordMatchScore: number;
  skillCoverageScore: number;
  candidateName: string;
  email: string;
  phone: string;
  education: string;
  verifiedProjectsCount: number;
  status: 'active' | 'archived';
  rawHighlights: string[];
  extractedSkills: Array<{
    name: string;
    category: Skill['category'];
    proficiency: number;
    confidence: number;
  }>;
}

const STORAGE_KEY = 'skillbridge_student_resumes_v2';
export const RESUMES_UPDATED_EVENT = 'skillbridge_resumes_updated';

const defaultResumes: StoredResume[] = [];

export const loadStoredResumes = (): StoredResume[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveStoredResumes([]);
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [];
  } catch (e) {
    console.error('Failed to load stored resumes:', e);
    return [];
  }
};

export const saveStoredResumes = (resumes: StoredResume[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
    window.dispatchEvent(new CustomEvent(RESUMES_UPDATED_EVENT, { detail: resumes }));
  } catch (e) {
    console.error('Failed to save stored resumes:', e);
  }
};

export const addStoredResume = (resume: StoredResume): void => {
  const current = loadStoredResumes();
  // set others to archived if this is active
  const updated = [
    resume,
    ...current.map(r => ({ ...r, status: 'archived' as const }))
  ];
  saveStoredResumes(updated);
};
