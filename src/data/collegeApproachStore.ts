export interface CollegeApproachRequest {
  id: string;
  collegeId: string;
  collegeName: string;
  collegeLogo?: string;
  tpoName: string;
  tpoEmail: string;
  tpoPhone?: string;
  companyId: string;
  companyName: string;
  title: string;
  proposalType: 'Campus Placement Drive' | 'Internship & PPO Pool' | 'Skill Hackathon & Hiring' | 'Curriculum & Lab Partnership';
  targetBatch: string;
  targetBranches: string[];
  eligibleStudentCount: number;
  avgCgpa: string;
  verifiedSkillsHighlights: string[];
  proposedDriveDates: string;
  proposedMode: 'On-Campus (Offline)' | 'Hybrid' | 'Virtual / Remote';
  expectedPackageRange: string;
  campusFacilities: string[];
  coverLetter: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  companyRemarks?: string;
  hrContactPerson?: string;
  confirmedDriveDates?: string;
  approvedAt?: string;
  updatedAt?: string;
  publishedJobId?: string;
  isJobPublishedToStudents?: boolean;
}

const STORAGE_KEY = 'skillbridge_college_approach_requests_v1';
export const COLLEGE_APPROACH_UPDATED_EVENT = 'skillbridge_college_approach_updated';

export const defaultCollegeApproaches: CollegeApproachRequest[] = [];

export const loadCollegeApproachRequests = (): CollegeApproachRequest[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load college approach requests', e);
  }
  return [];
};

export const saveCollegeApproachRequests = (requests: CollegeApproachRequest[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    window.dispatchEvent(new CustomEvent(COLLEGE_APPROACH_UPDATED_EVENT, { detail: requests }));
  } catch (e) {
    console.error('Failed to save college approach requests', e);
  }
};

import { notifyCompanyOfCollegeApproach, notifyCollegeOfProposalDecision } from './notificationStore';

export const addCollegeApproachRequest = (
  newRequest: Omit<CollegeApproachRequest, 'id' | 'submittedAt' | 'status'>
): CollegeApproachRequest => {
  const current = loadCollegeApproachRequests();
  const created: CollegeApproachRequest = {
    ...newRequest,
    id: `COL-APP-${Date.now().toString().slice(-4)}`,
    submittedAt: 'Just Now',
    status: 'pending',
  };
  const updated = [created, ...current];
  saveCollegeApproachRequests(updated);

  // Notify Company of incoming proposal from college
  notifyCompanyOfCollegeApproach({
    collegeName: created.collegeName,
    tpoName: created.tpoName,
    targetBatch: created.targetBatch,
    targetBranches: created.targetBranches,
    proposedDates: created.proposedDriveDates,
  });

  return created;
};

export const approveCollegeApproachRequest = (
  id: string, 
  companyRemarks: string, 
  hrContactPerson?: string,
  confirmedDriveDates?: string
) => {
  const current = loadCollegeApproachRequests();
  const targetReq = current.find((r) => r.id === id);
  const updated = current.map((req) => {
    if (req.id === id) {
      return {
        ...req,
        status: 'approved' as const,
        companyRemarks: companyRemarks.trim() || 'Approved by Company Talent Acquisition. Slot confirmed for recruitment drive.',
        hrContactPerson: hrContactPerson?.trim() || 'Talent Acquisition Team',
        confirmedDriveDates: confirmedDriveDates?.trim() || req.proposedDriveDates,
        approvedAt: 'Just Now',
        updatedAt: new Date().toISOString()
      };
    }
    return req;
  });
  saveCollegeApproachRequests(updated);

  // Notify TPO that company accepted
  if (targetReq) {
    notifyCollegeOfProposalDecision({
      collegeName: targetReq.collegeName,
      companyName: targetReq.companyName,
      isApproved: true,
      confirmedDates: confirmedDriveDates || targetReq.proposedDriveDates,
      remarks: companyRemarks,
    });
  }
};

export const rejectCollegeApproachRequest = (id: string, reason: string) => {
  const current = loadCollegeApproachRequests();
  const targetReq = current.find((r) => r.id === id);
  const updated = current.map((req) => {
    if (req.id === id) {
      return {
        ...req,
        status: 'rejected' as const,
        companyRemarks: reason.trim() || 'Declined due to scheduling constraints or hiring cap reached.',
        updatedAt: new Date().toISOString()
      };
    }
    return req;
  });
  saveCollegeApproachRequests(updated);

  // Notify TPO that company declined
  if (targetReq) {
    notifyCollegeOfProposalDecision({
      collegeName: targetReq.collegeName,
      companyName: targetReq.companyName,
      isApproved: false,
      remarks: reason,
    });
  }
};

export const markProposalJobPublished = (proposalId: string, jobId: string) => {
  const current = loadCollegeApproachRequests();
  const updated = current.map((p) => {
    if (p.id === proposalId) {
      return {
        ...p,
        isJobPublishedToStudents: true,
        publishedJobId: jobId,
        updatedAt: new Date().toISOString()
      };
    }
    return p;
  });
  saveCollegeApproachRequests(updated);
};

