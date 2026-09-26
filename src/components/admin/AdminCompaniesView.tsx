import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Briefcase, 
  Users, 
  Search, 
  CheckCircle2, 
  ExternalLink, 
  PlusCircle, 
  FileText, 
  Clock, 
  Sparkles,
  Ban,
  RotateCcw,
  Eye,
  Info,
  CheckCircle,
  LayoutGrid,
  List,
  MapPin,
  Mail
} from 'lucide-react';
import { loadApprovalRecords, saveApprovalRecords, ApprovalRecord } from '../../data/approvalStore';
import { notifyCompanyOfAdminApproval } from '../../data/notificationStore';
import { AdminCompanyDetailModal } from './AdminCompanyDetailModal';
import { AdminStudentDetailModal } from './AdminStudentDetailModal';

export interface AdminCompaniesViewProps {
  initialSubTab?: 'all-companies' | 'internships-jobs' | 'applications-overview';
  subTab?: 'all-companies' | 'internships-jobs' | 'applications-overview';
  onNavigateTab?: (tab: string) => void;
}

export interface CompanyListing {
  id: string;
  name: string;
  industry: string;
  email: string;
  activeJobs: number;
  totalHired: number;
  status: 'Active' | 'Pending Approval' | 'Delisted';
  delistReason?: string;
  location: string;
  registeredDate: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  applicationsCount: number;
  status: 'Active (Direct Live)' | 'Closed';
  stipend: string;
  postedDate: string;
  location: string;
  skillsRequired: string[];
}

const defaultCompanies: CompanyListing[] = [
  { id: 'COM1', name: 'TechNova Solutions', industry: 'Cloud & AI SaaS', email: 'talent@technova.com', activeJobs: 6, totalHired: 42, status: 'Active', location: 'Bengaluru / Remote', registeredDate: '05 Jan 2025' },
  { id: 'COM2', name: 'DataHub Solutions', industry: 'Analytics & FinTech', email: 'recruiter@datahub.io', activeJobs: 4, totalHired: 28, status: 'Active', location: 'Hyderabad', registeredDate: '18 Jan 2025' },
  { id: 'COM3', name: 'DesignCraft Studios', industry: 'Product & UI/UX', email: 'jobs@designcraft.com', activeJobs: 3, totalHired: 15, status: 'Active', location: 'Mumbai', registeredDate: '22 Jan 2025' },
  { id: 'COM4', name: 'CodeSoft Systems', industry: 'Distributed Computing', email: 'careers@codesoft.org', activeJobs: 5, totalHired: 34, status: 'Active', location: 'Pune', registeredDate: '10 Feb 2025' },
  { id: 'COM5', name: 'InnoMind AI', industry: 'Generative AI & LLMs', email: 'hiring@innomind.ai', activeJobs: 8, totalHired: 19, status: 'Active', location: 'Bengaluru', registeredDate: '28 Feb 2025' },
  { id: 'COM6', name: 'ZetaEdge Technologies', industry: 'Cybersecurity & Web3', email: 'hr@zetaedge.tech', activeJobs: 2, totalHired: 8, status: 'Pending Approval', location: 'Noida', registeredDate: 'Today 10:45' },
  { id: 'COM7', name: 'CloudScale Corp', industry: 'Infrastructure & SRE', email: 'ops@cloudscale.net', activeJobs: 1, totalHired: 0, status: 'Pending Approval', location: 'Gurugram', registeredDate: 'Yesterday 14:20' },
];

const mockDirectJobs: JobListing[] = [
  { id: 'JOB1', title: 'Frontend Developer Intern', company: 'TechNova Solutions', applicationsCount: 91, status: 'Active (Direct Live)', stipend: '₹40,000/mo', postedDate: '15 May 2025', location: 'Remote', skillsRequired: ['React', 'TypeScript', 'Tailwind'] },
  { id: 'JOB2', title: 'Data Analyst Intern', company: 'DataHub Solutions', applicationsCount: 64, status: 'Active (Direct Live)', stipend: '₹35,000/mo', postedDate: '18 May 2025', location: 'Hyderabad', skillsRequired: ['SQL', 'Python', 'PowerBI'] },
  { id: 'JOB3', title: 'UI/UX Design Intern', company: 'DesignCraft Studios', applicationsCount: 53, status: 'Active (Direct Live)', stipend: '₹30,000/mo', postedDate: '20 May 2025', location: 'Mumbai', skillsRequired: ['Figma', 'Prototyping', 'Design Systems'] },
  { id: 'JOB4', title: 'Backend Developer Intern', company: 'CodeSoft Systems', applicationsCount: 48, status: 'Active (Direct Live)', stipend: '₹45,000/mo', postedDate: '22 May 2025', location: 'Pune', skillsRequired: ['Node.js', 'PostgreSQL', 'Docker'] },
  { id: 'JOB5', title: 'AI/ML Intern', company: 'InnoMind AI', applicationsCount: 37, status: 'Active (Direct Live)', stipend: '₹50,000/mo', postedDate: '24 May 2025', location: 'Bengaluru', skillsRequired: ['PyTorch', 'FastAPI', 'LangChain'] },
];

export const AdminCompaniesView: React.FC<AdminCompaniesViewProps> = ({ 
  initialSubTab = 'all-companies',
  subTab
}) => {
  const currentIncoming = subTab || initialSubTab;
  const [activeTab, setActiveTab] = useState<'companies' | 'jobs' | 'applications'>(
    currentIncoming === 'internships-jobs' ? 'jobs' : currentIncoming === 'applications-overview' ? 'applications' : 'companies'
  );
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [companies, setCompanies] = useState<CompanyListing[]>(() => {
    const stored = loadApprovalRecords();
    return defaultCompanies.map(c => {
      const match = stored.find(s => s.id === c.id);
      if (match) {
        return {
          ...c,
          status: match.status === 'active' ? 'Active' : match.status === 'delisted' ? 'Delisted' : 'Pending Approval',
          delistReason: match.delistedReason || c.delistReason
        };
      }
      return c;
    });
  });
  const [jobs, setJobs] = useState<JobListing[]>(mockDirectJobs);
  const [notice, setNotice] = useState<string | null>(null);
  const [delistingCompany, setDelistingCompany] = useState<CompanyListing | null>(null);
  const [customDelistReason, setCustomDelistReason] = useState('');
  const [selectedCompanyDetails, setSelectedCompanyDetails] = useState<CompanyListing | null>(null);
  const [selectedStudentIdForModal, setSelectedStudentIdForModal] = useState<string | null>(null);

  // Sync state whenever prop changes from sidebar navigation!
  useEffect(() => {
    if (subTab === 'internships-jobs') {
      setActiveTab('jobs');
    } else if (subTab === 'applications-overview') {
      setActiveTab('applications');
    } else if (subTab === 'all-companies') {
      setActiveTab('companies');
    }
  }, [subTab]);

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleApproveCompany = (company: CompanyListing) => {
    setCompanies(prev => prev.map(c => c.id === company.id ? { ...c, status: 'Active', delistReason: undefined } : c));
    
    // Persist in shared approval store so company can directly login!
    const store = loadApprovalRecords();
    const updated = store.map(item => item.id === company.id ? { ...item, status: 'active' as const, approvedAt: 'Just Now' } : item);
    if (!store.some(i => i.id === company.id)) {
      updated.push({
        id: company.id,
        name: company.name,
        role: 'company',
        email: company.email,
        status: 'active',
        registeredAt: company.registeredDate,
        approvedAt: 'Just Now'
      });
    }
    saveApprovalRecords(updated);

    // Trigger real-time notification to company
    notifyCompanyOfAdminApproval({ companyName: company.name });

    setNotice(`Approved company: ${company.name}. Employer can now log in directly anytime without requiring further approval.`);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleOpenDelist = (company: CompanyListing) => {
    setDelistingCompany(company);
    setCustomDelistReason('Delisted by Admin: Suspicious recruiting practices or guideline violation.');
  };

  const handleConfirmDelist = () => {
    if (!delistingCompany) return;
    setCompanies(prev => prev.map(c => {
      if (c.id === delistingCompany.id) {
        return {
          ...c,
          status: 'Delisted',
          delistReason: customDelistReason || 'Delisted by Administrator'
        };
      }
      return c;
    }));

    const store = loadApprovalRecords();
    const updated = store.map(item => item.id === delistingCompany.id ? { ...item, status: 'delisted' as const, delistedReason: customDelistReason } : item);
    saveApprovalRecords(updated);

    setNotice(`Delisted company: ${delistingCompany.name}. Job postings hidden and login disabled.`);
    setDelistingCompany(null);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleRestoreCompany = (company: CompanyListing) => {
    setCompanies(prev => prev.map(c => c.id === company.id ? { ...c, status: 'Active', delistReason: undefined } : c));
    
    const store = loadApprovalRecords();
    const updated = store.map(item => item.id === company.id ? { ...item, status: 'active' as const, delistedReason: undefined } : item);
    saveApprovalRecords(updated);

    setNotice(`Restored active employer standing for ${company.name}. Direct login re-enabled.`);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">Companies & Opportunities Portal</h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {companies.filter(c => c.status === 'Active').length} Active Employers
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Admin Control: Review initial corporate registrations, grant direct login approvals, and manage employer delisting.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search companies, jobs, locations..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Direct Job Policy Notice */}
      <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <span className="font-semibold text-blue-900">Company & Job Workflow:</span> When a company signs up, they require one-time Admin approval. Once approved, <span className="font-semibold text-slate-900">they can directly login anytime without asking for approval</span>. Furthermore, <span className="font-semibold text-emerald-800">companies post jobs directly without requiring Admin approval</span>. Admin retains the authority to <span className="font-semibold text-rose-700">delist any company</span> at any time.
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-fade-in">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'companies' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>All Companies ({companies.length})</span>
            {companies.some(c => c.status === 'Pending Approval') && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                {companies.filter(c => c.status === 'Pending Approval').length} Pending
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'jobs' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Internships & Jobs ({jobs.length})</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Direct Live
            </span>
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'applications' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Applications & ATS Throughput</span>
          </button>
        </div>

        {/* View Mode Toggle: Cards vs Table */}
        {activeTab !== 'applications' && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-end sm:self-auto shrink-0">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Responsive Executive Cards"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Cards View</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Auto-Fitting Compact Table"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Compact Table</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab 1: Companies (Cards vs Table) */}
      {activeTab === 'companies' && (
        <>
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredCompanies.map(c => (
                <div
                  key={c.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between shadow-2xs hover:shadow-md ${
                    c.status === 'Delisted'
                      ? 'border-rose-200 bg-rose-50/20'
                      : c.status === 'Pending Approval'
                      ? 'border-amber-200 bg-amber-50/20'
                      : 'border-slate-200/90 hover:border-indigo-300'
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          c.status === 'Delisted' ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <button
                            onClick={() => setSelectedCompanyDetails(c)}
                            className="text-left font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer block leading-tight text-sm group"
                          >
                            <span className="group-hover:underline">{c.name}</span>
                          </button>
                          <div className="text-[11px] text-slate-400 mt-0.5">{c.email}</div>
                        </div>
                      </div>

                      {/* Status */}
                      {c.status === 'Active' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved
                        </span>
                      )}
                      {c.status === 'Pending Approval' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                      {c.status === 'Delisted' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 shrink-0">
                          <Ban className="w-3 h-3" />
                          Delisted
                        </span>
                      )}
                    </div>

                    {/* Metadata Pill */}
                    <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">{c.industry}</span>
                        <span className="text-[11px] text-slate-500">{c.location}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">Registered: {c.registeredDate}</div>
                    </div>

                    {/* Hiring & Openings Stats */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100 text-center">
                        <span className="text-[10px] text-slate-400 font-medium block">Live Job Postings</span>
                        <span className="text-base font-bold text-slate-900 mt-0.5 block">{c.activeJobs} Jobs</span>
                      </div>
                      <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100 text-center">
                        <span className="text-[10px] text-slate-400 font-medium block">Campus Hires</span>
                        <span className="text-base font-bold text-indigo-700 mt-0.5 block">{c.totalHired} Placed</span>
                      </div>
                    </div>

                    {c.delistReason && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 font-medium">
                        <span className="font-bold">Delist Notice:</span> {c.delistReason}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedCompanyDetails(c)}
                      className="flex-1 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Recruiting Dossier</span>
                    </button>

                    {c.status === 'Pending Approval' ? (
                      <button
                        onClick={() => handleApproveCompany(c)}
                        className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    ) : c.status === 'Delisted' ? (
                      <button
                        onClick={() => handleRestoreCompany(c)}
                        className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenDelist(c)}
                        className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                        title="Revoke company recruiting privileges"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Delist</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
              <table className="w-full text-left text-xs table-auto">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-3 px-4 w-[32%]">Company & Industry</th>
                    <th className="py-3 px-4 w-[24%]">Location & Registered</th>
                    <th className="py-3 px-4 w-[24%]">Hiring & Direct Access</th>
                    <th className="py-3 px-4 w-[20%] text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCompanies.map(c => (
                    <tr key={c.id} className={`transition-colors ${c.status === 'Delisted' ? 'bg-rose-50/30' : 'hover:bg-slate-50/60'}`}>
                      {/* Col 1 */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                            c.status === 'Delisted' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-800'
                          }`}>
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <button
                              onClick={() => setSelectedCompanyDetails(c)}
                              className="text-left group cursor-pointer block"
                            >
                              <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors underline decoration-slate-300 underline-offset-2">
                                {c.name}
                              </span>
                            </button>
                            <div className="text-[11px] text-slate-400 mt-0.5">{c.email}</div>
                            <div className="text-[11px] text-indigo-700 font-medium mt-0.5">{c.industry}</div>
                          </div>
                        </div>
                      </td>

                      {/* Col 2 */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="text-slate-800 font-medium">{c.location}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Joined: {c.registeredDate}</div>
                      </td>

                      {/* Col 3 */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{c.activeJobs} live jobs</span>
                          <span className="text-[11px] text-slate-400">• {c.totalHired} hired</span>
                        </div>
                        <div className="mt-1">
                          {c.status === 'Active' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Direct Login Access
                            </span>
                          )}
                          {c.status === 'Pending Approval' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                              <Clock className="w-3 h-3" />
                              Awaiting Approval
                            </span>
                          )}
                          {c.status === 'Delisted' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              <Ban className="w-3 h-3" />
                              Delisted
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Col 4 */}
                      <td className="py-3.5 px-4 text-right align-top">
                        <div className="flex items-center justify-end gap-1.5">
                          {c.status === 'Pending Approval' ? (
                            <button
                              onClick={() => handleApproveCompany(c)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedCompanyDetails(c)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Dossier</span>
                            </button>
                          )}

                          {c.status === 'Delisted' ? (
                            <button
                              onClick={() => handleRestoreCompany(c)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Restore</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenDelist(c)}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Delist company"
                            >
                              <Ban className="w-3 h-3" />
                              <span>Delist</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Tab 2: Internships & Jobs (Cards vs Table) */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Company job postings do not require admin approval. All listings below were published directly by verified employers.</span>
          </div>

          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredJobs.map(job => (
                <div key={job.id} className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 p-5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{job.title}</h3>
                        <p className="text-xs text-indigo-700 font-semibold mt-0.5">{job.company}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        Live
                      </span>
                    </div>

                    <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1 text-xs">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{job.stipend}</span>
                        <span className="text-slate-500 font-normal">{job.location}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Posted on: {job.postedDate}</div>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Required Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {job.skillsRequired.map((sk, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                      {job.applicationsCount} Applicants
                    </span>
                    <span className="text-[11px] text-slate-400">Direct Live Posting</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
              <table className="w-full text-left text-xs table-auto">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-3 px-4 w-[30%]">Opportunity Title & Company</th>
                    <th className="py-3 px-4 w-[25%]">Stipend & Location</th>
                    <th className="py-3 px-4 w-[25%]">Required Skills</th>
                    <th className="py-3 px-4 w-[20%] text-right">Applicants & Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredJobs.map(job => (
                    <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div>{job.title}</div>
                        <div className="text-xs text-indigo-700 font-semibold">{job.company}</div>
                        <span className="text-[10px] text-slate-400 font-normal">Posted: {job.postedDate}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{job.stipend}</div>
                        <div className="text-[11px] text-slate-400">{job.location}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {job.skillsRequired.map((sk, idx) => (
                            <span key={idx} className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px]">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md text-[11px] inline-block">
                          {job.applicationsCount} Applicants
                        </div>
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Live
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Applications Overview */}
      {activeTab === 'applications' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Active Openings</h3>
            <p className="text-2xl font-bold text-slate-900 mt-2">29 Openings</p>
            <p className="text-xs text-emerald-600 mt-1 font-medium">Direct live without gating</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Applicant Throughput</h3>
            <p className="text-2xl font-bold text-slate-900 mt-2">1,480 Candidates</p>
            <p className="text-xs text-indigo-600 mt-1 font-medium">84% ATS Average Match</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Offers Dispatched</h3>
            <p className="text-2xl font-bold text-slate-900 mt-2">146 Hired</p>
            <p className="text-xs text-slate-500 mt-1">Across 320 partner companies</p>
          </div>
        </div>
      )}

      {/* Corporate Recruiting & Campus Drives Minute Details Dossier */}
      {selectedCompanyDetails && (
        <AdminCompanyDetailModal
          companyIdOrName={selectedCompanyDetails.name}
          onClose={() => setSelectedCompanyDetails(null)}
          onOpenStudentDossier={(studentId) => setSelectedStudentIdForModal(studentId)}
          onApproveCompany={(companyId) => {
            handleApproveCompany(selectedCompanyDetails);
            setSelectedCompanyDetails(null);
          }}
          onDelistCompany={(companyId, reason) => {
            setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, status: 'Delisted', delistReason: reason } : c));
            setSelectedCompanyDetails(null);
          }}
        />
      )}

      {/* Cross-Modal Student Deep Dive */}
      {selectedStudentIdForModal && (
        <AdminStudentDetailModal
          studentIdOrName={selectedStudentIdForModal}
          onClose={() => setSelectedStudentIdForModal(null)}
        />
      )}

      {/* Delist Modal */}
      {delistingCompany && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <Ban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delist Company Account</h3>
                <p className="text-xs text-slate-500">Revoke hiring access and freeze jobs.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Delisting <span className="font-bold text-slate-900">{delistingCompany.name}</span> will suspend all recruiter accounts and hide active job postings from students.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for Delisting:
              </label>
              <textarea
                value={customDelistReason}
                onChange={(e) => setCustomDelistReason(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDelistingCompany(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelist}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
              >
                Confirm Delist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
