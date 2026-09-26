import { StudentSkillRequest, Skill } from '../types';

export type { StudentSkillRequest };

const STORAGE_KEY = 'skillbridge_skill_requests_v2';
export const SKILL_REQUESTS_UPDATED_EVENT = 'skillbridge_skill_requests_updated';

export const defaultSkillRequests: StudentSkillRequest[] = [];

export const loadSkillRequests = (): StudentSkillRequest[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load skill requests', e);
  }
  return [];
};

export const saveSkillRequests = (requests: StudentSkillRequest[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    window.dispatchEvent(new CustomEvent(SKILL_REQUESTS_UPDATED_EVENT, { detail: requests }));
  } catch (e) {
    console.error('Failed to save skill requests', e);
  }
};

export const addStudentSkillRequest = (
  skillName: string,
  category: Skill['category'],
  reason: string,
  studentName = 'Harshit Seth',
  collegeName = 'Institute of Technology, Jodhpur'
): StudentSkillRequest => {
  const current = loadSkillRequests();
  const newRequest: StudentSkillRequest = {
    id: `SKR-${Date.now().toString().slice(-4)}`,
    studentName,
    studentRoll: '22BCSE104',
    collegeName,
    skillName: skillName.trim(),
    category,
    reason: reason.trim(),
    submittedAt: 'Just Now',
    status: 'pending',
  };

  const updated = [newRequest, ...current];
  saveSkillRequests(updated);
  return newRequest;
};

export const updateSkillRequestStatus = (
  id: string,
  status: 'approved' | 'rejected',
  tpoRemarks?: string
) => {
  const current = loadSkillRequests();
  const updated = current.map((req) =>
    req.id === id ? { ...req, status, tpoRemarks: tpoRemarks || req.tpoRemarks } : req
  );
  saveSkillRequests(updated);
};
