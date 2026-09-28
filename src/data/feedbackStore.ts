export interface CompanyBatchFeedback {
  id: string;
  companyName: string;
  collegeName: string;
  department: string;
  batchYear: string; // e.g. "Batch 2026"
  hiringDriveTitle: string; // e.g. "Campus Recruitment Drive 2026"
  dateSubmitted: string;
  
  // Core requirements:
  // Skills missing in this graduating batch
  missingSkills: string[];
  
  // Skills demanded by company but not found in students
  requiredSkillsNotFound: string[];
  
  // Skills where candidates performed well
  satisfactorySkills: string[];
  
  // Actionable curriculum directives & recommendations to College TPO
  improvementDirective: string;
  
  // Evaluation Analytics
  studentsEvaluatedCount: number;
  readinessScore: number; // percentage (0-100)
  shortlistedCount: number;
  priority: 'High' | 'Critical' | 'Medium';
  status: 'Delivered to TPO' | 'Acknowledged by College' | 'Curriculum Action Initiated';
  tpoResponseNote?: string;
  acknowledgedAt?: string;
  responseSubmittedAt?: string;
  acknowledgedBy?: string;
}

// Backward compatibility interface for individual candidate scorecards if needed
export interface CandidateFeedback {
  id: string;
  candidateName: string;
  candidateRoll?: string;
  collegeName: string;
  companyName: string;
  roleApplied: string;
  interviewDate: string;
  rating: number;
  technicalCompetency: number;
  communicationScore: number;
  problemSolvingScore: number;
  status: 'Selected / Offer Extended' | 'Shortlisted for Round 2' | 'Waitlisted' | 'Needs Skill Improvement';
  strengths: string[];
  growthAreas: string[];
  interviewerNotes: string;
}

const BATCH_FEEDBACK_STORAGE_KEY = 'skillbridge_company_to_college_feedback_v2';
const CANDIDATE_FEEDBACK_STORAGE_KEY = 'skillbridge_candidate_feedback_v2';
export const FEEDBACK_UPDATED_EVENT = 'skillbridge_feedback_updated';
export const BATCH_FEEDBACK_UPDATED_EVENT = 'skillbridge_batch_feedback_updated';

export const defaultBatchFeedbacks: CompanyBatchFeedback[] = [];

export const defaultCandidateFeedbacks: CandidateFeedback[] = [];

export const loadBatchFeedbackList = (): CompanyBatchFeedback[] => {
  try {
    const saved = localStorage.getItem(BATCH_FEEDBACK_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load batch feedback', e);
  }
  return [];
};

export const saveBatchFeedbackList = (list: CompanyBatchFeedback[]) => {
  try {
    localStorage.setItem(BATCH_FEEDBACK_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(BATCH_FEEDBACK_UPDATED_EVENT, { detail: list }));
    window.dispatchEvent(new CustomEvent(FEEDBACK_UPDATED_EVENT, { detail: list }));
  } catch (e) {
    console.error('Failed to save batch feedback', e);
  }
};

import { notifyTpoOfCompanyFeedback, notifyCompanyOfTpoFeedbackAction } from './notificationStore';

export const addCompanyBatchFeedback = (
  item: Omit<CompanyBatchFeedback, 'id' | 'dateSubmitted'>
): CompanyBatchFeedback => {
  const current = loadBatchFeedbackList();
  const created: CompanyBatchFeedback = {
    ...item,
    id: `BFDB-${Date.now().toString().slice(-4)}`,
    dateSubmitted: new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  };
  const updated = [created, ...current];
  saveBatchFeedbackList(updated);

  // Notify TPO of new feedback
  notifyTpoOfCompanyFeedback({
    companyName: created.companyName,
    department: created.department,
    batchYear: created.batchYear,
    missingSkills: created.missingSkills || [],
  });

  return created;
};

export const updateBatchFeedbackStatus = (
  id: string,
  status: CompanyBatchFeedback['status'],
  tpoResponseNote?: string,
  acknowledgedBy: string = 'TPO Office, MBM University, Jodhpur'
) => {
  const current = loadBatchFeedbackList();
  const targetItem = current.find((i) => i.id === id);
  const nowStr = new Date().toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) + ', ' + new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const updated = current.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        status,
        acknowledgedBy: item.acknowledgedBy || acknowledgedBy,
        acknowledgedAt: item.acknowledgedAt || nowStr,
        ...(tpoResponseNote ? { tpoResponseNote, responseSubmittedAt: nowStr } : {})
      };
    }
    return item;
  });
  saveBatchFeedbackList(updated);

  // Notify Company that TPO has accepted / acted on feedback
  if (targetItem) {
    notifyCompanyOfTpoFeedbackAction({
      collegeName: targetItem.collegeName,
      companyName: targetItem.companyName,
      department: targetItem.department,
      status,
      tpoNote: tpoResponseNote,
    });
  }
};

// Retrieve all responses received from colleges for companies
export const loadReceivedResponses = (companyName?: string): CompanyBatchFeedback[] => {
  const all = loadBatchFeedbackList();
  return all.filter((item) => {
    const isResponded = item.status === 'Acknowledged by College' || item.status === 'Curriculum Action Initiated';
    if (!companyName || companyName === 'All') return isResponded;
    return isResponded && (item.companyName.toLowerCase().includes(companyName.toLowerCase()) || companyName.toLowerCase().includes(item.companyName.toLowerCase()));
  });
};

// Backward-compatibility exports for candidate evaluations if needed
export const loadFeedbackList = (): CandidateFeedback[] => {
  try {
    const saved = localStorage.getItem(CANDIDATE_FEEDBACK_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load candidate feedback', e);
  }
  return [];
};

export const saveFeedbackList = (list: CandidateFeedback[]) => {
  try {
    localStorage.setItem(CANDIDATE_FEEDBACK_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(FEEDBACK_UPDATED_EVENT, { detail: list }));
  } catch (e) {
    console.error('Failed to save candidate feedback', e);
  }
};

export const addCandidateFeedback = (
  item: Omit<CandidateFeedback, 'id' | 'interviewDate'>
): CandidateFeedback => {
  const current = loadFeedbackList();
  const created: CandidateFeedback = {
    ...item,
    id: `FDB-${Date.now().toString().slice(-4)}`,
    interviewDate: 'Today'
  };
  const updated = [created, ...current];
  saveFeedbackList(updated);
  return created;
};
