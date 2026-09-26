import { AppNotification, UserRole } from '../types';

const STORAGE_KEY = 'skillbridge_notifications_v2';
export const NOTIFICATIONS_UPDATED_EVENT = 'skillbridge_notifications_updated';

export const defaultNotifications: AppNotification[] = [];

export const loadNotifications = (): AppNotification[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load notifications', e);
  }
  return [];
};

export const saveNotifications = (notifications: AppNotification[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED_EVENT, { detail: notifications }));
  } catch (e) {
    console.error('Failed to save notifications', e);
  }
};

export const addNotification = (
  notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'> & { timestamp?: string; isRead?: boolean }
): AppNotification => {
  const current = loadNotifications();
  const created: AppNotification = {
    ...notif,
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: notif.timestamp || 'Just now',
    isRead: notif.isRead ?? false,
  };
  const updated = [created, ...current];
  saveNotifications(updated);
  return created;
};

// ==========================================
// SPECIFIC CROSS-ROLE NOTIFICATION TRIGGERS
// ==========================================

// 1. Company sends on-campus drive request to TPO
export const notifyTpoOfCampusDriveRequest = (params: {
  companyName: string;
  jobTitle: string;
  driveStartDate: string;
  driveEndDate: string;
  eligibleBranches: string[];
}) => {
  addNotification({
    title: `New On-Campus Drive Request from ${params.companyName}`,
    message: `${params.companyName} submitted an on-campus recruitment request for "${params.jobTitle}" (Dates: ${params.driveStartDate} to ${params.driveEndDate}). Eligible branches: ${params.eligibleBranches.join(', ')}. Action required in Requests.`,
    category: 'drive',
    targetRole: 'institution',
    targetTab: 'requests',
    priority: 'high',
    senderName: params.companyName,
    senderRole: 'company',
  });
};

// 2. TPO posts / schedules drive for students
export const notifyStudentsOfCampusDrive = (params: {
  companyName: string;
  jobTitle: string;
  driveDates: string;
  eligibleBranches: string[];
  stipend?: string;
  tpoName?: string;
}) => {
  addNotification({
    title: `On-Campus Placement Drive: ${params.companyName}`,
    message: `${params.tpoName || 'TPO Office'} announced on-campus drive for ${params.companyName} ("${params.jobTitle}"${params.stipend ? ` - ${params.stipend}` : ''}). Drive Dates: ${params.driveDates}. Eligible: ${params.eligibleBranches.join(', ')}. View details & apply!`,
    category: 'job',
    targetRole: 'student',
    targetTab: 'internships',
    priority: 'high',
    senderName: params.tpoName || 'Placement Cell',
    senderRole: 'institution',
  });
};

// 3. TPO Nudges students for a specific stream/branch or general readiness
export const notifyStudentsOfTpoNudge = (params: {
  stream: string;
  nudgeMessage?: string;
  tpoName?: string;
  targetStudentName?: string;
}) => {
  addNotification({
    title: `TPO Placement Nudge (${params.stream})`,
    message: params.nudgeMessage || `${params.tpoName || 'Head TPO'} has nudged students in ${params.stream}: Upcoming campus drives are starting soon. Ensure your required skills are verified through AST Code Defense and update your resume portfolio.`,
    category: 'nudge',
    targetRole: 'student',
    targetTab: 'skills',
    priority: 'urgent',
    stream: params.stream,
    senderName: params.tpoName || 'TPO Office',
    senderRole: 'institution',
  });
};

// 4. College sends approach request to company
export const notifyCompanyOfCollegeApproach = (params: {
  collegeName: string;
  tpoName: string;
  targetBatch: string;
  targetBranches: string[];
  proposedDates: string;
}) => {
  addNotification({
    title: `New Campus Drive Proposal from ${params.collegeName}`,
    message: `${params.tpoName} (${params.collegeName}) submitted a campus recruitment proposal for ${params.targetBatch} (${params.targetBranches.join(', ')}). Proposed Dates: ${params.proposedDates}. Review proposal in Requests.`,
    category: 'request',
    targetRole: 'company',
    targetTab: 'requests',
    priority: 'high',
    senderName: `${params.tpoName} (${params.collegeName})`,
    senderRole: 'institution',
  });
};

// 5. Company profile approved by Super Admin
export const notifyCompanyOfAdminApproval = (params: {
  companyName: string;
}) => {
  addNotification({
    title: `Company Profile Approved by Super Admin`,
    message: `Congratulations! ${params.companyName} has been verified by Super Admin. You can now post campus drives and contact university TPOs directly.`,
    category: 'approval',
    targetRole: 'company',
    targetTab: 'dashboard',
    priority: 'normal',
    senderName: 'Super Admin',
    senderRole: 'admin',
  });
};

// 6. College request accepted or rejected by Company
export const notifyCollegeOfProposalDecision = (params: {
  collegeName: string;
  companyName: string;
  isApproved: boolean;
  confirmedDates?: string;
  remarks?: string;
}) => {
  if (params.isApproved) {
    addNotification({
      title: `Campus Drive Accepted: ${params.companyName}`,
      message: `${params.companyName} has ACCEPTED your campus recruitment invitation! Confirmed drive dates: ${params.confirmedDates || 'As proposed'}. Remarks: "${params.remarks || 'Slot confirmed. Team is preparing assessment rounds.'}"`,
      category: 'approval',
      targetRole: 'institution',
      targetTab: 'requests',
      priority: 'high',
      senderName: params.companyName,
      senderRole: 'company',
    });
  } else {
    addNotification({
      title: `Campus Drive Declined: ${params.companyName}`,
      message: `${params.companyName} declined your campus drive proposal. Reason: "${params.remarks || 'Hiring target reached for this cycle.'}"`,
      category: 'request',
      targetRole: 'institution',
      targetTab: 'requests',
      priority: 'normal',
      senderName: params.companyName,
      senderRole: 'company',
    });
  }
};

// 7. Company submits hiring feedback to TPO
export const notifyTpoOfCompanyFeedback = (params: {
  companyName: string;
  department: string;
  batchYear: string;
  missingSkills: string[];
}) => {
  addNotification({
    title: `Hiring Feedback from ${params.companyName} (${params.department})`,
    message: `${params.companyName} submitted campus hiring review for ${params.batchYear}. Highlighted missing skills: ${params.missingSkills.join(', ')}. Actionable curriculum directives are now available in Feedback.`,
    category: 'feedback',
    targetRole: 'institution',
    targetTab: 'feedback',
    priority: 'high',
    senderName: params.companyName,
    senderRole: 'company',
  });
};

// 8. TPO accepts/acts on or rejects company feedback
export const notifyCompanyOfTpoFeedbackAction = (params: {
  collegeName: string;
  companyName: string;
  department: string;
  status: string;
  tpoNote?: string;
}) => {
  addNotification({
    title: `Curriculum Action from ${params.collegeName}`,
    message: `TPO at ${params.collegeName} has updated feedback status to "${params.status}" for ${params.department}. Note: "${params.tpoNote || 'Curriculum updates initiated for upcoming batch.'}"`,
    category: 'feedback',
    targetRole: 'company',
    targetTab: 'feedback',
    priority: 'normal',
    senderName: `TPO, ${params.collegeName}`,
    senderRole: 'institution',
  });
};
