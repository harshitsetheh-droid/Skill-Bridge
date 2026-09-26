import { Internship } from '../types';

const STORAGE_KEY = 'skillbridge_internships_v3';
export const JOBS_UPDATED_EVENT = 'skillbridge_jobs_updated';

export const defaultInternshipsWithCampus: Internship[] = [];

export const loadInternships = (): Internship[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load internships', e);
  }
  return [];
};

export const saveInternships = (jobs: Internship[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    window.dispatchEvent(new CustomEvent(JOBS_UPDATED_EVENT, { detail: jobs }));
  } catch (e) {
    console.error('Failed to save internships', e);
  }
};

export const addInternship = (newJob: Omit<Internship, 'id' | 'applicantsCount' | 'isApplied'>): Internship => {
  const current = loadInternships();
  const created: Internship = {
    ...newJob,
    id: `job-${Date.now()}`,
    applicantsCount: 0,
    isApplied: false,
  };
  const updated = [created, ...current];
  saveInternships(updated);
  return created;
};

export const updateJobTpoStatus = (targetUniversity: string, jobTitle: string, status: 'approved' | 'rejected') => {
  const current = loadInternships();
  const updated = current.map((job) => {
    if (
      job.campusType === 'on_campus' &&
      job.targetUniversity?.toLowerCase() === targetUniversity.toLowerCase() &&
      job.title.toLowerCase() === jobTitle.toLowerCase()
    ) {
      return { ...job, tpoApprovalStatus: status };
    }
    return job;
  });
  saveInternships(updated);
};
