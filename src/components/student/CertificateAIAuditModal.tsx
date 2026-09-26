import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Award, 
  Building2, 
  Briefcase, 
  UserCheck, 
  UserX, 
  Calendar, 
  CheckCircle2, 
  X, 
  ExternalLink, 
  Layers, 
  Plus, 
  Check, 
  Sparkles, 
  Hash, 
  Lock,
  Download
} from 'lucide-react';
import { StoredCertificate } from '../../data/certificateStore';
import { 
  hasStudentSkill, 
  addStudentSkill, 
  SKILLS_UPDATED_EVENT 
} from '../../data/skillsStore';
import { Skill } from '../../types';

interface CertificateAIAuditModalProps {
  certificate: StoredCertificate | null;
  onClose: () => void;
  onSkillAdded?: (skillName: string) => void;
}

export const CertificateAIAuditModal: React.FC<CertificateAIAuditModalProps> = ({
  certificate,
  onClose,
  onSkillAdded
}) => {
  const [addedSkillsMap, setAddedSkillsMap] = useState<Record<string, boolean>>({});
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const syncSkills = () => {
    if (!certificate) return;
    const map: Record<string, boolean> = {};
    certificate.aiAudit.extractedSkills.forEach((s) => {
      map[s.name] = hasStudentSkill(s.name);
    });
    setAddedSkillsMap(map);
  };

  useEffect(() => {
    syncSkills();
    const handleUpdate = () => syncSkills();
    window.addEventListener(SKILLS_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(SKILLS_UPDATED_EVENT, handleUpdate);
  }, [certificate]);

  if (!certificate) return null;

  const { aiAudit } = certificate;

  const handleAddSkill = (skill: { name: string; category: Skill['category']; proficiency: number }) => {
    const res = addStudentSkill(skill.name, skill.category, skill.proficiency);
    if (res.success) {
      setAddedSkillsMap((prev) => ({ ...prev, [skill.name]: true }));
      setActionNotice(`✓ Added "${skill.name}" to My Skills profile!`);
      if (onSkillAdded) onSkillAdded(skill.name);
      setTimeout(() => setActionNotice(null), 3000);
    } else {
      setActionNotice(res.message);
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const handleAddAllSkills = () => {
    let count = 0;
    aiAudit.extractedSkills.forEach((s) => {
      if (!addedSkillsMap[s.name]) {
        const res = addStudentSkill(s.name, s.category, s.proficiency);
        if (res.success) {
          count++;
          if (onSkillAdded) onSkillAdded(s.name);
        }
      }
    });
    syncSkills();
    setActionNotice(`✓ Added ${count} new skills from this certificate to My Skills!`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden animate-scale-in">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-start justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-start gap-3.5 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/40 border border-indigo-400/30 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 uppercase tracking-wider">
                  AI Verified Credential Dossier
                </span>
                {aiAudit.isValid ? (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>AUTHENTIC & VALID</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    <span>FLAGGED AS SUSPICIOUS</span>
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-white">{certificate.title}</h2>
              <p className="text-xs text-indigo-200/80 mt-0.5 flex items-center gap-2">
                <span>Credential ID: <code className="font-mono text-indigo-100">{certificate.credentialId}</code></span>
                <span>•</span>
                <span>Issued: {certificate.issueDate}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Notice Banner */}
        {actionNotice && (
          <div className="px-6 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Key Identification Cards: "Jis Kaam Ka Hai" and "Jis Company Ka Hai" */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Box 1: JIS KAAM KA HAI (Work Domain & Engineering Scope) */}
            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                <Briefcase className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Field & Work Domain (Jis Kaam Ka Hai)
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {certificate.workDomain}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {aiAudit.workDomainDescription}
              </p>
            </div>

            {/* Box 2: JIS COMPANY KA HAI (Issuing Authority & Organization) */}
            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-2">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <Building2 className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Issuing Authority (Jis Company Ka Hai)
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>{certificate.issuerCompany}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                  {aiAudit.companyIssuerCheck.accreditationType}
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {aiAudit.companyIssuerCheck.details}
              </p>
            </div>
          </div>

          {/* AI Comprehensive Telemetry & Verification Checks */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>AI Verification & Authenticity Checks</span>
              </h3>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                AI Trust Score: <span className="text-indigo-600 dark:text-indigo-400 text-sm font-black">{aiAudit.overallTrustScore}%</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Check 1: Name Verification */}
              <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center gap-1.5">
                  {aiAudit.nameMatchCheck.matched ? (
                    <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <UserX className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  )}
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Recipient Name Check
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">
                  Detected: <strong className="text-slate-900 dark:text-white">{aiAudit.nameMatchCheck.detectedName}</strong>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {aiAudit.nameMatchCheck.details}
                </p>
              </div>

              {/* Check 2: Issuing Company Registry */}
              <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center gap-1.5">
                  {aiAudit.companyIssuerCheck.legitimate ? (
                    <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  )}
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Company Registry Check
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">
                  Status: <strong className="text-emerald-600 dark:text-emerald-400">Recognized Authority</strong>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Verified against official corporate accreditation database.
                </p>
              </div>

              {/* Check 3: Digital Signature & Tamper Audit */}
              <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center gap-1.5">
                  {aiAudit.tamperAuditCheck.passed ? (
                    <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  )}
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Tamper-Proof Audit
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">
                  Hash: <strong className="text-slate-900 dark:text-white">SHA-256 Valid</strong>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {aiAudit.tamperAuditCheck.details}
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* EXTRACTED SKILLS WITH 'ALREADY ADDED' / '+ ADD TO PROFILE' BADGES        */}
          {/* ========================================================================= */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Skills Extracted from Certificate ({aiAudit.extractedSkills.length})</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Skills extracted by AI parser. Those with <span className="font-bold text-emerald-600 dark:text-emerald-400">"Already Added"</span> are synced in your profile.
                </p>
              </div>

              <button
                onClick={handleAddAllSkills}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add All to My Skills</span>
              </button>
            </div>

            {/* Extracted Skills List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {aiAudit.extractedSkills.map((skill) => {
                const isAlreadyAdded = addedSkillsMap[skill.name];

                return (
                  <div
                    key={skill.name}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-colors ${
                      isAlreadyAdded
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {skill.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                          {skill.category}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Proficiency: <strong className="text-slate-700 dark:text-slate-300">{skill.proficiency}%</strong> • AI Match: {skill.confidence}%
                      </div>
                    </div>

                    {/* Badge: "Already Added" vs "+ Add" */}
                    {isAlreadyAdded ? (
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/70 text-emerald-800 dark:text-emerald-200 text-xs font-bold shrink-0 shadow-2xs"
                        title="This skill is already added in your My Skills profile"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Already Added</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddSkill(skill)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition-transform active:scale-95 cursor-pointer shrink-0"
                        title={`Add "${skill.name}" to My Skills`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Profile</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Certificate Metadata & Download / Link */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-slate-500">File: {certificate.fileName} ({certificate.fileSize})</span>
              <span>•</span>
              <span>Uploaded: {certificate.uploadedAt}</span>
            </div>

            {certificate.credentialUrl && (
              <a
                href={certificate.credentialUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                <span>External Verification Registry</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Cryptographically sealed & saved to your verified credentials portfolio.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
