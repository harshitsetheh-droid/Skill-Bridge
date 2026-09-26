import { Skill } from '../types';
import { hasStudentSkill, addStudentSkill } from './skillsStore';

export interface CertificateAIAudit {
  isValid: boolean;
  overallTrustScore: number; // 0 - 100
  nameMatchCheck: {
    matched: boolean;
    detectedName: string;
    targetName: string;
    details: string;
  };
  companyIssuerCheck: {
    legitimate: boolean;
    companyName: string;
    accreditationType: 'Global Enterprise' | 'Accredited University' | 'Industry Consortium' | 'Unrecognized';
    details: string;
  };
  tamperAuditCheck: {
    passed: boolean;
    signatureValid: boolean;
    layoutIntegrity: boolean;
    details: string;
  };
  workDomain: string; // "Jis kaam ka hai"
  workDomainDescription: string;
  extractedSkills: Array<{
    name: string;
    category: Skill['category'];
    proficiency: number;
    confidence: number;
  }>;
  auditTimestamp: string;
  credentialId: string;
  credentialUrl?: string;
}

export interface StoredCertificate {
  id: string;
  title: string;
  workDomain: string; // "Jis kaam ka hai" (e.g. Frontend Web Architecture & Client-Side State Engines)
  issuerCompany: string; // "Jis company ka hai" (e.g. Meta Platforms Inc. / Coursera)
  recipientName: string;
  nameMatchesUser: boolean;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  credentialUrl?: string;
  status: 'verified' | 'flagged' | 'under_review';
  aiAudit: CertificateAIAudit;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  previewColor: string;
}

const STORAGE_KEY = 'skillbridge_student_certificates_v3';
export const CERTIFICATES_UPDATED_EVENT = 'skillbridge_certificates_updated';

// Default authentic certificates for Harshit Seth
const defaultCertificates: StoredCertificate[] = [];

export const loadStudentCertificates = (): StoredCertificate[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveStudentCertificates([]);
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [];
  } catch (e) {
    console.error('Failed to load student certificates:', e);
    return [];
  }
};

export const saveStudentCertificates = (certs: StoredCertificate[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(certs));
    window.dispatchEvent(new CustomEvent(CERTIFICATES_UPDATED_EVENT, { detail: certs }));
  } catch (e) {
    console.error('Failed to save student certificates:', e);
  }
};

export const addStudentCertificate = (cert: StoredCertificate): void => {
  const current = loadStudentCertificates();
  // If already exists with same id, replace it; otherwise prepend
  const exists = current.findIndex(c => c.id === cert.id);
  let updated: StoredCertificate[];
  if (exists >= 0) {
    updated = [...current];
    updated[exists] = cert;
  } else {
    updated = [cert, ...current];
  }
  saveStudentCertificates(updated);
};

export const deleteStudentCertificate = (id: string): void => {
  const current = loadStudentCertificates();
  const updated = current.filter(c => c.id !== id);
  saveStudentCertificates(updated);
};

// Preset sample certificate profiles for testing AI verification
export interface SampleCertificateOption {
  id: string;
  name: string;
  issuerCompany: string; // "Jis company ka hai"
  workDomain: string; // "Jis kaam ka hai"
  intendedRecipient: string;
  simulateFailure?: boolean;
  failureReason?: string;
  skills: Array<{ name: string; category: Skill['category']; proficiency: number; confidence: number }>;
}

export const sampleCertificatePresets: SampleCertificateOption[] = [
  {
    id: 'sample-aws-solutions',
    name: 'AWS Certified Solutions Architect – Associate',
    issuerCompany: 'Amazon Web Services (AWS)',
    workDomain: 'Cloud Infrastructure, High Availability & Microservices Architecture',
    intendedRecipient: 'Harshit Seth',
    skills: [
      { name: 'Docker & Containers', category: 'DevOps', proficiency: 86, confidence: 96 },
      { name: 'Linux', category: 'DevOps', proficiency: 84, confidence: 94 },
      { name: 'System Design & High Availability', category: 'Core CS', proficiency: 82, confidence: 92 },
      { name: 'PostgreSQL', category: 'Database', proficiency: 85, confidence: 91 },
      { name: 'Redis', category: 'Database', proficiency: 80, confidence: 89 }
    ]
  },
  {
    id: 'sample-deeplearning-ai',
    name: 'Machine Learning Specialization with TensorFlow',
    issuerCompany: 'DeepLearning.AI / Stanford Online',
    workDomain: 'Artificial Intelligence, Deep Learning & Predictive Neural Models',
    intendedRecipient: 'Harshit Seth',
    skills: [
      { name: 'Machine Learning (AI/ML)', category: 'Core CS', proficiency: 88, confidence: 97 },
      { name: 'Python', category: 'Backend', proficiency: 92, confidence: 98 },
      { name: 'Algorithms & Problem Solving', category: 'Core CS', proficiency: 85, confidence: 93 },
      { name: 'FastAPI', category: 'Backend', proficiency: 80, confidence: 90 }
    ]
  },
  {
    id: 'sample-docker-linux',
    name: 'Certified Kubernetes & Docker Associate (CKAD Prep)',
    issuerCompany: 'The Linux Foundation & CNCF',
    workDomain: 'Container Orchestration, Cloud-Native Ingress & DevOps Pipelines',
    intendedRecipient: 'Harshit Seth',
    skills: [
      { name: 'Docker & Containers', category: 'DevOps', proficiency: 90, confidence: 98 },
      { name: 'Linux', category: 'DevOps', proficiency: 88, confidence: 95 },
      { name: 'Git & GitHub', category: 'DevOps', proficiency: 90, confidence: 96 },
      { name: 'WebSockets', category: 'Backend', proficiency: 82, confidence: 91 }
    ]
  },
  {
    id: 'sample-fake-fraud',
    name: 'Master of Distributed Quantum Computing (Diploma Mill)',
    issuerCompany: 'GlobalFastTrack Tech Academy (Unaccredited)',
    workDomain: 'Unverified Theoretical Computing',
    intendedRecipient: 'Rahul K. Verma', // Mismatched recipient name!
    simulateFailure: true,
    failureReason: 'Recipient name mismatch ("Rahul K. Verma" != "Harshit Seth") & Issuer domain failed accreditation audit.',
    skills: [
      { name: 'Quantum Cryptography', category: 'Core CS', proficiency: 99, confidence: 20 },
      { name: 'Supervised Learning', category: 'Core CS', proficiency: 95, confidence: 30 }
    ]
  }
];
