import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Award, 
  ExternalLink, 
  ShieldCheck, 
  ShieldAlert,
  FileText, 
  RefreshCw, 
  Check, 
  Plus, 
  Layers,
  ArrowRight,
  Info,
  Building2,
  Briefcase,
  UserCheck,
  UserX,
  Lock,
  Calendar,
  Trash2,
  Eye,
  Search,
  Filter,
  BadgeCheck,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { 
  loadStudentSkills, 
  addStudentSkill, 
  hasStudentSkill, 
  SKILLS_UPDATED_EVENT 
} from '../../data/skillsStore';
import { 
  loadStudentCertificates, 
  saveStudentCertificates, 
  addStudentCertificate, 
  deleteStudentCertificate, 
  StoredCertificate, 
  CERTIFICATES_UPDATED_EVENT,
  sampleCertificatePresets,
  SampleCertificateOption
} from '../../data/certificateStore';
import { 
  loadStoredResumes, 
  addStoredResume, 
  StoredResume, 
  RESUMES_UPDATED_EVENT 
} from '../../data/resumeStore';
import { CertificateAIAuditModal } from './CertificateAIAuditModal';
import { Skill } from '../../types';

interface ExtractedSkill {
  name: string;
  category: Skill['category'];
  proficiency: number;
  confidence: number;
}

export const ResumeAnalyzerView: React.FC = () => {
  // Navigation Tabs: Certificates Parser, Resume ATS Parser, Stored Credentials Vault
  const [activeSubTab, setActiveSubTab] = useState<'certificates' | 'resume' | 'vault'>('certificates');

  // Certificate Parser State
  const [certificatesList, setCertificatesList] = useState<StoredCertificate[]>([]);
  const [certScanning, setCertScanning] = useState(false);
  const [certScanStep, setCertScanStep] = useState<string>('');
  const [currentParsedCert, setCurrentParsedCert] = useState<StoredCertificate | null>(null);
  const [selectedCertForModal, setSelectedCertForModal] = useState<StoredCertificate | null>(null);
  const [selectedSamplePreset, setSelectedSamplePreset] = useState<string>('sample-aws-solutions');
  
  // Custom uploaded file state
  const [uploadedCertFileName, setUploadedCertFileName] = useState<string | null>(null);

  // Resume State
  const [resumesList, setResumesList] = useState<StoredResume[]>([]);
  const [activeResume, setActiveResume] = useState<StoredResume | null>(null);
  const [resumeAnalyzing, setResumeAnalyzing] = useState(false);
  const [resumeParsedSkills, setResumeParsedSkills] = useState<ExtractedSkill[]>([]);

  // Skills Sync State
  const [addedSkillsMap, setAddedSkillsMap] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' | 'info' } | null>(null);

  const currentUserTargetName = 'Harshit Seth';

  // Synchronize student skills with local map
  const syncSkillsMap = () => {
    const map: Record<string, boolean> = {};
    
    // Check all resume parsed skills
    resumeParsedSkills.forEach((s) => {
      map[s.name] = hasStudentSkill(s.name);
    });

    // Check all current certificate parsed skills
    if (currentParsedCert) {
      currentParsedCert.aiAudit.extractedSkills.forEach((s) => {
        map[s.name] = hasStudentSkill(s.name);
      });
    }

    // Check all stored certificates' skills
    certificatesList.forEach((c) => {
      c.aiAudit.extractedSkills.forEach((s) => {
        map[s.name] = hasStudentSkill(s.name);
      });
    });

    setAddedSkillsMap(map);
  };

  // Load initial data from persistent stores
  useEffect(() => {
    const certs = loadStudentCertificates();
    setCertificatesList(certs);
    if (certs.length > 0 && !currentParsedCert) {
      setCurrentParsedCert(certs[0]); // Default to first verified certificate (e.g. Meta Frontend)
    }

    const resumes = loadStoredResumes();
    setResumesList(resumes);
    if (resumes.length > 0) {
      setActiveResume(resumes[0]);
      setResumeParsedSkills(resumes[0].extractedSkills);
    }
  }, []);

  // Listen to external storage updates
  useEffect(() => {
    syncSkillsMap();

    const handleSkillsUpdate = () => syncSkillsMap();
    const handleCertsUpdate = () => {
      const updated = loadStudentCertificates();
      setCertificatesList(updated);
      syncSkillsMap();
    };
    const handleResumesUpdate = () => {
      const updated = loadStoredResumes();
      setResumesList(updated);
      if (updated.length > 0) {
        setActiveResume(updated[0]);
        setResumeParsedSkills(updated[0].extractedSkills);
      }
      syncSkillsMap();
    };

    window.addEventListener(SKILLS_UPDATED_EVENT, handleSkillsUpdate);
    window.addEventListener(CERTIFICATES_UPDATED_EVENT, handleCertsUpdate);
    window.addEventListener(RESUMES_UPDATED_EVENT, handleResumesUpdate);

    return () => {
      window.removeEventListener(SKILLS_UPDATED_EVENT, handleSkillsUpdate);
      window.removeEventListener(CERTIFICATES_UPDATED_EVENT, handleCertsUpdate);
      window.removeEventListener(RESUMES_UPDATED_EVENT, handleResumesUpdate);
    };
  }, [resumeParsedSkills, currentParsedCert, certificatesList]);

  // Trigger Toast Notification
  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle adding an individual skill to My Skills profile
  const handleAddSkillToProfile = (skill: { name: string; category: Skill['category']; proficiency: number }) => {
    const result = addStudentSkill(skill.name, skill.category, skill.proficiency);
    if (result.success) {
      setAddedSkillsMap((prev) => ({ ...prev, [skill.name]: true }));
      showToast(`✓ Successfully added "${skill.name}" to your verified skills profile!`, 'success');
    } else {
      showToast(result.message, 'warning');
    }
  };

  // Handle batch adding all skills from active certificate
  const handleAddAllCertificateSkills = () => {
    if (!currentParsedCert) return;
    let addedCount = 0;
    currentParsedCert.aiAudit.extractedSkills.forEach((s) => {
      if (!addedSkillsMap[s.name]) {
        const res = addStudentSkill(s.name, s.category, s.proficiency);
        if (res.success) addedCount++;
      }
    });
    syncSkillsMap();
    if (addedCount > 0) {
      showToast(`✓ Added ${addedCount} new skills from "${currentParsedCert.title}" to My Skills!`, 'success');
    } else {
      showToast('All skills from this certificate are already present in your profile.', 'info');
    }
  };

  // Handle batch adding all skills from active resume
  const handleAddAllResumeSkills = () => {
    let addedCount = 0;
    resumeParsedSkills.forEach((s) => {
      if (!addedSkillsMap[s.name]) {
        const res = addStudentSkill(s.name, s.category, s.proficiency);
        if (res.success) addedCount++;
      }
    });
    syncSkillsMap();
    if (addedCount > 0) {
      showToast(`✓ Added ${addedCount} new skills from your resume directly to My Skills!`, 'success');
    } else {
      showToast('All extracted resume skills are already added in your profile.', 'info');
    }
  };

  // Run AI Certificate Verification & Parsing Pipeline
  const handleScanCertificate = (presetId?: string) => {
    const targetPresetId = presetId || selectedSamplePreset;
    const preset = sampleCertificatePresets.find((p) => p.id === targetPresetId);
    if (!preset) return;

    setCertScanning(true);
    setCertScanStep('Extracting optical glyphs & certificate verification serial...');

    setTimeout(() => {
      setCertScanStep(`Checking recipient identity against profile ("${currentUserTargetName}")...`);
    }, 600);

    setTimeout(() => {
      setCertScanStep(`Auditing issuing company ("${preset.issuerCompany}") against accreditation authority registry...`);
    }, 1200);

    setTimeout(() => {
      setCertScanStep('Running SHA-256 digital signature & tamper-proof anti-fraud verification...');
    }, 1800);

    setTimeout(() => {
      setCertScanStep('Synthesizing work domain ("Jis Kaam Ka Hai") & extracting industry skills...');
    }, 2400);

    setTimeout(() => {
      setCertScanning(false);
      setCertScanStep('');

      const isFailure = !!preset.simulateFailure;
      const isNameMatched = preset.intendedRecipient === currentUserTargetName;

      const newCert: StoredCertificate = {
        id: `cert-${Date.now()}`,
        title: preset.name,
        workDomain: preset.workDomain,
        issuerCompany: preset.issuerCompany,
        recipientName: preset.intendedRecipient,
        nameMatchesUser: isNameMatched,
        issueDate: isFailure ? 'Aug 2026 (Anomalous)' : 'Aug 2026',
        expiryDate: isFailure ? 'Expired' : 'Aug 2029',
        credentialId: isFailure ? 'INVALID-DIPLOMA-HASH-ERR' : `CRED-${preset.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        credentialUrl: isFailure ? undefined : `https://verify.org/credential/${preset.id}`,
        status: isFailure ? 'flagged' : 'verified',
        fileName: uploadedCertFileName || `${preset.name.replace(/[^a-zA-Z0-9]/g, '_')}_HarshitSeth.pdf`,
        fileSize: '384 KB',
        uploadedAt: 'Just now',
        previewColor: isFailure ? 'from-rose-700 to-red-950' : 'from-indigo-600 to-purple-800',
        aiAudit: {
          isValid: !isFailure,
          overallTrustScore: isFailure ? 24 : 96,
          nameMatchCheck: {
            matched: isNameMatched,
            detectedName: preset.intendedRecipient,
            targetName: currentUserTargetName,
            details: isNameMatched
              ? `100% exact match: Certificate issued to "${preset.intendedRecipient}", matching logged-in student.`
              : `MISMATCH DETECTED: Certificate issued to "${preset.intendedRecipient}", but logged-in user is "${currentUserTargetName}". Possible proxy or fraudulent submission.`
          },
          companyIssuerCheck: {
            legitimate: !isFailure,
            companyName: preset.issuerCompany,
            accreditationType: isFailure ? 'Unrecognized' : 'Global Enterprise',
            details: isFailure
              ? 'Issuer is unaccredited. Domain DNS records registered 4 days ago with high risk flag.'
              : `Accredited corporate entity. Cryptographic verification registry confirmed valid.`
          },
          tamperAuditCheck: {
            passed: !isFailure,
            signatureValid: !isFailure,
            layoutIntegrity: !isFailure,
            details: isFailure
              ? 'FAIL: Digital certificate signature invalid; font rasterization artifacts indicate edited PDF text layer.'
              : 'PASS: Cryptographic public-key signature verified. Zero font substitution anomalies.'
          },
          workDomain: preset.workDomain,
          workDomainDescription: isFailure
            ? 'Flagged: Course syllabus cannot be mapped to recognized computer science curricula.'
            : `Practical mastery demonstrated in ${preset.workDomain}.`,
          extractedSkills: preset.skills,
          auditTimestamp: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
          credentialId: isFailure ? 'FLAGGED-SUSPICIOUS-HASH' : `CRED-${preset.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
          credentialUrl: isFailure ? undefined : `https://verify.org/credential/${preset.id}`
        }
      };

      setCurrentParsedCert(newCert);
      
      // Store certificate in persistent storage!
      addStudentCertificate(newCert);

      if (isFailure) {
        showToast(`⚠️ AI Alert: Certificate flagged! ${preset.failureReason || 'Verification checks failed.'}`, 'warning');
      } else {
        showToast(`✓ Certificate parsed & cryptographically verified! Extracted ${preset.skills.length} skills.`, 'success');
      }
    }, 3000);
  };

  // Handle manual file upload (PDF/image)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedCertFileName(file.name);
      showToast(`Selected file: "${file.name}". Click "Run AI Verification & Parse" to inspect.`, 'info');
    }
  };

  // Re-run Resume Analysis
  const handleRunResumeAnalysis = () => {
    setResumeAnalyzing(true);
    setTimeout(() => {
      setResumeAnalyzing(false);
      // Append a couple of newly discovered skills
      const updatedSkills = [
        ...resumeParsedSkills,
        ...(resumeParsedSkills.some((s) => s.name === 'Next.js')
          ? []
          : [
              { name: 'Next.js', category: 'Frontend' as const, proficiency: 84, confidence: 92 },
              { name: 'GraphQL', category: 'Backend' as const, proficiency: 78, confidence: 87 }
            ])
      ];
      setResumeParsedSkills(updatedSkills);
      
      const newResume: StoredResume = {
        id: `resume-${Date.now()}`,
        fileName: 'Harshit_Seth_Resume_v2_Scanned.pdf',
        fileSize: '148 KB',
        uploadedAt: 'Just now',
        atsScore: 93,
        formattingScore: 96,
        keywordMatchScore: 93,
        skillCoverageScore: 90,
        candidateName: currentUserTargetName,
        email: 'harshit.seth@itj.ac.in',
        phone: '+91 98765 43210',
        education: 'B.Tech Computer Science & Engineering • CGPA: 8.9 / 10.0 • MBM University, Jodhpur',
        verifiedProjectsCount: 3,
        status: 'active',
        rawHighlights: [
          'Architected sub-30ms low-latency multi-cursor canvas with vector clocks.',
          'Engineered LRU cache layer delivering 4.2x faster SQL queries using Redis & FastAPI.',
          'Next.js & GraphQL integration with type-safe codegen pipelines.'
        ],
        extractedSkills: updatedSkills
      };

      setActiveResume(newResume);
      addStoredResume(newResume);
      showToast('✓ Resume parsed & updated in credentials store! New competencies added.', 'success');
    }, 1400);
  };

  const resumeScores = activeResume ? {
    formatting: activeResume.formattingScore,
    keywordMatch: activeResume.keywordMatchScore,
    skillCoverage: activeResume.skillCoverageScore,
    overall: activeResume.atsScore,
  } : {
    formatting: 95,
    keywordMatch: 91,
    skillCoverage: 88,
    overall: 91,
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Toast notification banner */}
      {toastMessage && (
        <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-md transition-all animate-fade-in ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
            : toastMessage.type === 'warning'
            ? 'bg-amber-50 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100'
            : 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-100'
        }`}>
          <div className="flex items-center gap-2.5">
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
            {toastMessage.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />}
            {toastMessage.type === 'info' && <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
            <span>{toastMessage.text}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="hover:opacity-75 text-xs font-bold px-2 py-0.5"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Studio Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold uppercase tracking-wider">
              Credentials & Evidence Engine
            </span>
            <span className="text-xs text-slate-400">• Student: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{currentUserTargetName}</strong></span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Certificates & Resume Intelligence Studio
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Parse, AI-verify certificates against tampering, validate issuing company & recipient identity, extract competencies, and store verified credentials.
          </p>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shrink-0">
          <button
            onClick={() => setActiveSubTab('certificates')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'certificates'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certificate Parser & AI Check</span>
            <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
              {certificatesList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('resume')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'resume'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Resume ATS Parser</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
              {resumeScores.overall}%
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('vault')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'vault'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Saved Credentials Vault</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
              {certificatesList.length + resumesList.length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: CERTIFICATES PARSER & AI VERIFICATION                             */}
      {/* ========================================================================= */}
      {activeSubTab === 'certificates' && (
        <div className="space-y-6">
          
          {/* Section 1: Upload & Interactive AI Verification Box */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-indigo-200/80 dark:border-indigo-900/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Award className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    AI Certificate Inspector & Skill Extractor
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Upload any certificate (PDF/PNG/JPG) or select a sample preset below. The AI verification engine checks recipient name match, validates the issuing company, detects tampered signatures, identifies the work domain ("Jis Kaam Ka Hai"), and extracts skills with "Already Added" badges.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors">
                  <Upload className="w-4 h-4 text-indigo-600" />
                  <span>{uploadedCertFileName ? `File: ${uploadedCertFileName.substring(0, 15)}...` : 'Upload File (PDF/Image)'}</span>
                  <input
                    type="file"
                    accept=".pdf,image/png,image/jpeg"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>

                <button
                  disabled={certScanning}
                  onClick={() => handleScanCertificate()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-transform active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                  {certScanning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Run AI Verification & Parse</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Test Presets Selector */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Quick Test with Certificate Presets (1-Click Verification):</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  Target Student: <strong className="text-slate-700 dark:text-slate-300">{currentUserTargetName}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {sampleCertificatePresets.map((preset) => {
                  const isSelected = selectedSamplePreset === preset.id;
                  const isSuspicious = preset.simulateFailure;

                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setSelectedSamplePreset(preset.id);
                        handleScanCertificate(preset.id);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? isSuspicious
                            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 ring-2 ring-rose-400/30'
                            : 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-600 ring-2 ring-indigo-400/20'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSuspicious 
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                        }`}>
                          {isSuspicious ? '⚠️ Fraud Test' : '✓ Verified Authority'}
                        </span>
                        {isSuspicious ? (
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {preset.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        Issuer: {preset.issuerCompany}
                      </div>
                      <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                        Recipient: {preset.intendedRecipient}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Scanning Progress Telemetry Banner (when running) */}
            {certScanning && (
              <div className="mt-4 p-4 rounded-xl bg-indigo-900 text-white border border-indigo-700 flex flex-col sm:flex-row items-center gap-3 animate-pulse">
                <RefreshCw className="w-5 h-5 animate-spin text-indigo-300 shrink-0" />
                <div className="flex-1 text-center sm:text-left">
                  <div className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
                    AI Integrity & Cryptographic Scanner Active
                  </div>
                  <div className="text-sm font-semibold text-white mt-0.5">
                    {certScanStep || 'Analyzing digital certificate credentials...'}
                  </div>
                </div>
                <span className="text-xs text-indigo-300 font-mono bg-indigo-950/80 px-2.5 py-1 rounded-lg border border-indigo-700">
                  Step {certScanStep.includes('Extracting') ? '1/5' : certScanStep.includes('recipient') ? '2/5' : certScanStep.includes('Auditing') ? '3/5' : certScanStep.includes('signature') ? '4/5' : '5/5'}
                </span>
              </div>
            )}
          </div>

          {/* Section 2: PARSED CERTIFICATE DEEP-DIVE CARD WITH AI CHECKS */}
          {currentParsedCert && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6">
              
              {/* Top Banner: Verification Status */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                currentParsedCert.aiAudit.isValid 
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                  : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    currentParsedCert.aiAudit.isValid 
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}>
                    {currentParsedCert.aiAudit.isValid ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold">
                        {currentParsedCert.aiAudit.isValid 
                          ? 'AI VERIFIED & AUTHENTIC CREDENTIAL' 
                          : 'VERIFICATION FAILED: FRAUD OR TAMPERING DETECTED'}
                      </h3>
                      <span className="px-2 py-0.2 rounded-md bg-white/80 dark:bg-slate-800/80 text-[10px] font-extrabold uppercase">
                        AI Trust Score: {currentParsedCert.aiAudit.overallTrustScore}%
                      </span>
                    </div>
                    <p className="text-xs opacity-90 mt-0.5">
                      {currentParsedCert.aiAudit.isValid
                        ? `Cryptographically validated. Recipient name matches "${currentUserTargetName}" and issuer authority is recognized.`
                        : currentParsedCert.aiAudit.nameMatchCheck.details}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedCertForModal(currentParsedCert)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-600" />
                    <span>View Complete AI Dossier</span>
                  </button>
                </div>
              </div>

              {/* Title & Fundamental Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {currentParsedCert.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                    <span>Credential ID: <code className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{currentParsedCert.credentialId}</code></span>
                    <span>•</span>
                    <span>Issue Date: <strong className="text-slate-700 dark:text-slate-300">{currentParsedCert.issueDate}</strong></span>
                    <span>•</span>
                    <span>File: {currentParsedCert.fileName}</span>
                  </div>
                </div>

                {currentParsedCert.credentialUrl && (
                  <a
                    href={currentParsedCert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    <span>Verification Registry Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* ========================================================================= */}
              {/* "JIS KAAM KA HAI" & "JIS COMPANY KA HAI" PROMINENT HIGHLIGHTS             */}
              {/* ========================================================================= */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. JIS KAAM KA HAI (Work Domain / Field of Practical Application) */}
                <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border-2 border-indigo-200/80 dark:border-indigo-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-wider">
                        Field of Work ("Jis Kaam Ka Hai")
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                      Domain Certified
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {currentParsedCert.workDomain}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {currentParsedCert.aiAudit.workDomainDescription}
                  </p>
                </div>

                {/* 2. JIS COMPANY KA HAI (Issuing Company & Authority Legitimacy) */}
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border-2 border-blue-200/80 dark:border-blue-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                      <Building2 className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-wider">
                        Issuing Authority ("Jis Company Ka Hai")
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {currentParsedCert.aiAudit.companyIssuerCheck.accreditationType}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {currentParsedCert.issuerCompany}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {currentParsedCert.aiAudit.companyIssuerCheck.details}
                  </p>
                </div>
              </div>

              {/* Recipient & Tamper Audit Telemetry Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                {/* Name Match */}
                <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5">
                    {currentParsedCert.nameMatchesUser ? (
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <UserX className="w-4 h-4 text-rose-600" />
                    )}
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Recipient Identity Check
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                    Name: <strong className="text-slate-900 dark:text-white">{currentParsedCert.recipientName}</strong>
                  </div>
                  <div className={`text-[10px] font-semibold ${currentParsedCert.nameMatchesUser ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {currentParsedCert.nameMatchesUser ? '✓ Matches User Profile (Harshit Seth)' : '❌ Mismatched User Name'}
                  </div>
                </div>

                {/* Company Issuer Authenticity */}
                <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5">
                    {currentParsedCert.aiAudit.companyIssuerCheck.legitimate ? (
                      <Building2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                    )}
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Company Registry Status
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                    Issuer: <strong className="text-slate-900 dark:text-white">{currentParsedCert.issuerCompany}</strong>
                  </div>
                  <div className={`text-[10px] font-semibold ${currentParsedCert.aiAudit.companyIssuerCheck.legitimate ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {currentParsedCert.aiAudit.companyIssuerCheck.legitimate ? '✓ Verified Global Enterprise' : '❌ Unrecognized / Diploma Mill'}
                  </div>
                </div>

                {/* Anti-Tamper & Cryptography */}
                <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5">
                    {currentParsedCert.aiAudit.tamperAuditCheck.passed ? (
                      <Lock className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                    )}
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Tamper-Proof Audit
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                    Signature: <strong className="text-slate-900 dark:text-white">{currentParsedCert.aiAudit.tamperAuditCheck.passed ? 'SHA-256 Valid' : 'Corrupted Hash'}</strong>
                  </div>
                  <div className={`text-[10px] font-semibold ${currentParsedCert.aiAudit.tamperAuditCheck.passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {currentParsedCert.aiAudit.tamperAuditCheck.passed ? '✓ Zero Layout Anomalies' : '❌ Tampering Detected'}
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* EXTRACTED SKILLS PORTION WITH "ALREADY ADDED" BADGE                       */}
              {/* ========================================================================= */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Extracted Certificate Skills ({currentParsedCert.aiAudit.extractedSkills.length})
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Skills extracted from this certificate's syllabus. If a skill is already present in your profile, it is marked with <span className="font-bold text-emerald-600 dark:text-emerald-400">"Already Added"</span>.
                    </p>
                  </div>

                  <button
                    onClick={handleAddAllCertificateSkills}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add All to My Skills</span>
                  </button>
                </div>

                {/* Extracted Skills Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {currentParsedCert.aiAudit.extractedSkills.map((skill) => {
                    const isAlreadyAdded = addedSkillsMap[skill.name];

                    return (
                      <div
                        key={skill.name}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                          isAlreadyAdded
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80 shadow-2xs'
                            : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {skill.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-600 text-[9px] font-medium shrink-0">
                              {skill.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              Proficiency: <strong className="text-slate-700 dark:text-slate-300">{skill.proficiency}%</strong>
                            </span>
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                              {skill.confidence}% match
                            </span>
                          </div>
                        </div>

                        {/* "Already Added" badge vs "+ Add to Profile" Button */}
                        {isAlreadyAdded ? (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 text-[11px] font-bold shrink-0 border border-emerald-300 dark:border-emerald-700 shadow-2xs"
                            title="This skill is already in your My Skills profile"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Already Added</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAddSkillToProfile(skill)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition-transform active:scale-95 cursor-pointer shrink-0"
                            title={`Add "${skill.name}" to My Skills`}
                          >
                            <Plus className="w-3.5 h-3.5 font-bold" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Section 3: SAVED CERTIFICATES ROSTER ("Certificates Store Honge") */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Stored Certificates Vault ({certificatesList.length} Saved)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  All parsed and verified certificates are permanently stored and transmitted to recruiters and college TPO during placement drives.
                </p>
              </div>

              <span className="text-xs text-slate-400 font-medium">
                Auto-saved in local encrypted store
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificatesList.map((cert) => (
                <div
                  key={cert.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                    cert.status === 'verified'
                      ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300'
                      : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                  }`}
                >
                  <div>
                    {/* Top Status & Issuer Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          cert.status === 'verified'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {cert.status === 'verified' ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                          <span>{cert.status === 'verified' ? 'Verified Authentic' : 'Flagged Anomaly'}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          ID: {cert.credentialId}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          deleteStudentCertificate(cert.id);
                          showToast(`Removed certificate: "${cert.title}"`, 'info');
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Delete from saved vault"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {cert.title}
                    </h4>

                    {/* "Jis Kaam Ka Hai" & "Jis Company Ka Hai" */}
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300">
                        <Briefcase className="w-3.5 h-3.5 shrink-0" />
                        <span className="font-semibold truncate">Domain: {cert.workDomain}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                        <Building2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Company: {cert.issuerCompany}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                        <UserCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                        <span>Recipient: {cert.recipientName} ({cert.nameMatchesUser ? 'Match Verified' : 'Mismatch'})</span>
                      </div>
                    </div>

                    {/* Extracted Skills preview */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {cert.aiAudit.extractedSkills.slice(0, 4).map((sk) => {
                        const isAdded = addedSkillsMap[sk.name];
                        return (
                          <span
                            key={sk.name}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 ${
                              isAdded
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span>{sk.name}</span>
                            {isAdded && <Check className="w-2.5 h-2.5 text-emerald-600" />}
                          </span>
                        );
                      })}
                      {cert.aiAudit.extractedSkills.length > 4 && (
                        <span className="text-[10px] text-slate-400 px-1.5 py-0.5">
                          +{cert.aiAudit.extractedSkills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">Issued: {cert.issueDate}</span>
                    <button
                      onClick={() => setSelectedCertForModal(cert)}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Inspect AI Audit</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: RESUME ATS PARSER & AUDITOR                                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'resume' && (
        <div className="space-y-6">
          
          {/* Top Actions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                ATS Resume Parser & Semantic Audit
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Parsed from your active document: <strong className="text-slate-800 dark:text-slate-200">{activeResume?.fileName || 'Harshit_Seth_Resume_2026.pdf'}</strong>
              </p>
            </div>

            <button
              disabled={resumeAnalyzing}
              onClick={handleRunResumeAnalysis}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
            >
              {resumeAnalyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Scanning Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Re-Parse Resume Document</span>
                </>
              )}
            </button>
          </div>

          {/* Extracted Resume Skills with "Already Added" indicators */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-indigo-200/80 dark:border-indigo-900/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Extracted Resume Technical Skills ({resumeParsedSkills.length})
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Skills identified from work history and course projects. Those marked <span className="font-bold text-emerald-600 dark:text-emerald-400">"Already Added"</span> are synchronized with your profile.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleAddAllResumeSkills}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add All to My Skills</span>
                </button>
              </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {resumeParsedSkills.map((skill) => {
                const isAdded = addedSkillsMap[skill.name];

                return (
                  <div
                    key={skill.name}
                    className={`p-3 rounded-xl border transition-all duration-150 flex items-center justify-between gap-2 ${
                      isAdded
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-slate-50/80 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {skill.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700 text-[9px] font-medium shrink-0">
                          {skill.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          Proficiency: <strong className="text-slate-700 dark:text-slate-300">{skill.proficiency}%</strong>
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          {skill.confidence}% match
                        </span>
                      </div>
                    </div>

                    {/* Direct '+' add button or "Already Added" badge */}
                    {isAdded ? (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold shrink-0"
                        title="Already added to My Skills"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Already Added</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddSkillToProfile(skill)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-transform active:scale-95 shrink-0 cursor-pointer"
                        title={`Add "${skill.name}" directly to My Skills`}
                      >
                        <Plus className="w-4 h-4 font-bold" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resume Preview & ATS Score Audit */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Resume Visual Preview */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {activeResume?.fileName || 'Harshit_Seth_Resume_2026.pdf'}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">
                    Uploaded {activeResume?.uploadedAt || '2 days ago'}
                  </span>
                </div>

                {/* Structured Text Preview */}
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 space-y-3 leading-relaxed shadow-inner">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                    <div className="text-sm font-bold text-slate-900 dark:text-white font-sans">{currentUserTargetName.toUpperCase()}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">harshit.seth@itj.ac.in • github.com/harshitseth-dev • +91 98765 43210</div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-900 dark:text-slate-200 uppercase font-sans">Education</div>
                    <div className="flex justify-between">
                      <span className="font-semibold">B.Tech Computer Science & Engineering</span>
                      <span>2022 - 2026</span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">MBM University, Jodhpur • CGPA: 8.9 / 10.0</div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-900 dark:text-slate-200 uppercase font-sans">Projects & Evidence</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">• Distributed Real-Time Canvas (WebSockets, React, TypeScript)</div>
                    <div className="text-slate-500 dark:text-slate-400 text-[10px]">
                      Architected sub-30ms low-latency multi-cursor canvas. Handled 500+ events/sec with vector clocks.
                    </div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 mt-1">• Adaptive Query Cache Engine (Python, FastAPI, Redis)</div>
                    <div className="text-slate-500 dark:text-slate-400 text-[10px]">
                      Engineered LRU cache layer delivering 4.2x faster SQL query response times.
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-900 dark:text-slate-200 uppercase font-sans">Extracted Technical Skills</div>
                    <div className="text-[10px] text-slate-600 dark:text-slate-400">
                      React.js, TypeScript, Python, Tailwind CSS, SQL, Git, Linux, WebSockets, Docker, PostgreSQL
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  ATS Compliant Single-Column Format
                </span>
                <button
                  onClick={handleRunResumeAnalysis}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Re-Parse Resume</span>
                </button>
              </div>
            </div>

            {/* Right: ATS Scored Audit Breakdown */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    ATS Scored Audit Breakdown
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Evaluated against 1,200+ high-bar campus recruitment standards.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{resumeScores.overall}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold block">ATS Score</span>
                </div>
              </div>

              {/* Progress rows */}
              <div className="space-y-3.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Layout & Hierarchy Formatting</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{resumeScores.formatting} / 100</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${resumeScores.formatting}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    ✓ Clear header tags, standard typography, zero parse friction.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Industry Keyword Match</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{resumeScores.keywordMatch} / 100</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${resumeScores.keywordMatch}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    ✓ Strong keyword density for React, TypeScript, and Microservices.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Skill Evidence & Quantification</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{resumeScores.skillCoverage} / 100</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${resumeScores.skillCoverage}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    ✓ Quantified latency metrics included. Connect verified certificates to elevate further.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: CREDENTIALS VAULT (STORED RESUMES & CERTIFICATES)                 */}
      {/* ========================================================================= */}
      {activeSubTab === 'vault' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  <span>Persistent Credentials Vault</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Both resumes and verified certificates are permanently stored, verified against tampering, and synchronized across college and recruiter portals.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {certificatesList.length} Stored Certificates
                </span>
                <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {resumesList.length} Stored Resumes
                </span>
              </div>
            </div>

            {/* Section A: Stored Resumes */}
            <div className="space-y-3 mb-6">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Stored Resume Documents</span>
              </h3>

              <div className="space-y-2">
                {resumesList.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                        PDF
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{res.fileName}</span>
                          {res.status === 'active' && (
                            <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Uploaded: {res.uploadedAt} • Size: {res.fileSize} • Candidate: {res.candidateName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">ATS {res.atsScore}%</span>
                        <span className="text-[10px] text-slate-400 block">{res.extractedSkills.length} extracted skills</span>
                      </div>
                      <button
                        onClick={() => {
                          setActiveResume(res);
                          setActiveSubTab('resume');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section B: Stored Certificates */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Stored Certificates & Diplomas</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {certificatesList.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                          {cert.issuerCompany}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Trust {cert.aiAudit.overallTrustScore}%</span>
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {cert.title}
                      </h4>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">
                        <strong>Domain:</strong> {cert.workDomain}
                      </p>

                      <div className="mt-2 text-[10px] text-slate-500 font-mono">
                        Credential: {cert.credentialId}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400">{cert.aiAudit.extractedSkills.length} Skills Extracted</span>
                      <button
                        onClick={() => setSelectedCertForModal(cert)}
                        className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                      >
                        View AI Audit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Complete Certificate AI Audit & Telemetry Dossier */}
      {selectedCertForModal && (
        <CertificateAIAuditModal
          certificate={selectedCertForModal}
          onClose={() => setSelectedCertForModal(null)}
          onSkillAdded={(skillName) => {
            syncSkillsMap();
          }}
        />
      )}
    </div>
  );
};
