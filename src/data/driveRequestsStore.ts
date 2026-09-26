export interface CampusDriveRequest {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  universityName: string;
  jobTitle: string;
  jobType: 'Internship' | 'Full-time' | 'Contract';
  stipend: string;
  location: string;
  driveStartDate: string;
  driveEndDate: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  eligibleBranches: string[];
  minCgpa: string;
  roundsPlanned: string[];
  notes?: string;
  tpoRemarks?: string;
}

const STORAGE_KEY = 'skillbridge_drive_requests_v1';
export const DRIVE_REQUESTS_UPDATED_EVENT = 'skillbridge_drive_requests_updated';

export const defaultDriveRequests: CampusDriveRequest[] = [];

export const loadDriveRequests = (): CampusDriveRequest[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load drive requests', e);
  }
  return [];
};

export const saveDriveRequests = (requests: CampusDriveRequest[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    window.dispatchEvent(new CustomEvent(DRIVE_REQUESTS_UPDATED_EVENT, { detail: requests }));
  } catch (e) {
    console.error('Failed to save drive requests', e);
  }
};

import { notifyTpoOfCampusDriveRequest, notifyStudentsOfCampusDrive } from './notificationStore';

export const addDriveRequest = (newRequest: Omit<CampusDriveRequest, 'id' | 'submittedAt' | 'status'>): CampusDriveRequest => {
  const current = loadDriveRequests();
  const created: CampusDriveRequest = {
    ...newRequest,
    id: `REQ-${Date.now().toString().slice(-4)}`,
    submittedAt: 'Just Now',
    status: 'pending',
  };
  const updated = [created, ...current];
  saveDriveRequests(updated);

  // Notify TPO immediately
  notifyTpoOfCampusDriveRequest({
    companyName: created.companyName,
    jobTitle: created.jobTitle,
    driveStartDate: created.driveStartDate,
    driveEndDate: created.driveEndDate,
    eligibleBranches: created.eligibleBranches || ['All Engineering Streams'],
  });

  return created;
};

export const updateDriveRequestStatus = (id: string, status: 'approved' | 'rejected', remarks?: string) => {
  const current = loadDriveRequests();
  const targetReq = current.find((r) => r.id === id);
  const updated = current.map((req) =>
    req.id === id ? { ...req, status, tpoRemarks: remarks || req.tpoRemarks } : req
  );
  saveDriveRequests(updated);

  // When TPO approves the drive, notify Students that the job drive is live!
  if (status === 'approved' && targetReq) {
    notifyStudentsOfCampusDrive({
      companyName: targetReq.companyName,
      jobTitle: targetReq.jobTitle,
      driveDates: `${targetReq.driveStartDate} to ${targetReq.driveEndDate}`,
      eligibleBranches: targetReq.eligibleBranches || ['All Eligible Streams'],
      stipend: targetReq.stipend,
      tpoName: 'Dr. Sharma (TPO Office)',
    });
  }
};
