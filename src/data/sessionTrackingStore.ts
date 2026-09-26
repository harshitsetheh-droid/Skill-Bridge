import { UserRole } from '../types';

export interface UserLoginSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: UserRole;
  subRoleLabel: string; // e.g. 'Student', 'Company (HR Tech)', 'BPO / Recruitment Agency', 'College TPO', 'Super Admin'
  organization?: string;
  loginDate: string; // 'YYYY-MM-DD'
  loginDateDisplay: string; // '06 Sep 2026'
  loginTime: string; // '09:20:14 AM'
  loginTimestamp: number;
  endTime: string; // '11:42:30 AM' or 'Active Now'
  endTimestamp?: number;
  durationSeconds: number;
  durationDisplay: string; // '2h 22m'
  engagementSeconds: number;
  engagementDisplay: string; // '1h 58m active'
  engagementPercentage: number; // e.g. 83%
  status: 'active' | 'completed';
  pagesVisited: string[];
  totalInteractions: number;
  device: string;
  ipAddress: string;
  location: string;
}

const STORAGE_KEY = 'skillbridge_user_sessions_v1';
export const SESSIONS_UPDATED_EVENT = 'skillbridge_sessions_updated';

export const defaultSessions: UserLoginSession[] = [];

export const loadLoginSessions = (): UserLoginSession[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load user sessions', e);
  }
  return [];
};

export const saveLoginSessions = (sessions: UserLoginSession[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    window.dispatchEvent(new CustomEvent(SESSIONS_UPDATED_EVENT, { detail: sessions }));
  } catch (e) {
    console.error('Failed to save user sessions', e);
  }
};

export const recordSessionAction = (sessionId: string, pageName: string) => {
  const list = loadLoginSessions();
  const updated = list.map((s) => {
    if (s.id === sessionId) {
      const pages = s.pagesVisited.includes(pageName) ? s.pagesVisited : [...s.pagesVisited, pageName];
      return {
        ...s,
        pagesVisited: pages,
        totalInteractions: s.totalInteractions + 1,
      };
    }
    return s;
  });
  saveLoginSessions(updated);
};
