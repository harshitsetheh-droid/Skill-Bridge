// Central state store for company & TPO approvals, and delisting actions across SkillBridge

export interface ApprovalRecord {
  id: string;
  name: string;
  role: 'company' | 'institution' | 'student';
  email: string;
  status: 'pending_approval' | 'active' | 'delisted';
  registeredAt: string;
  approvedAt?: string;
  delistedReason?: string;
  details?: Record<string, any>;
}

const STORAGE_KEY = 'skillbridge_approval_store_v2';

// Initial Mock Records
const defaultRecords: ApprovalRecord[] = [];

export const loadApprovalRecords = (): ApprovalRecord[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load approval store', e);
  }
  return [];
};

export const saveApprovalRecords = (records: ApprovalRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save approval store', e);
  }
};
